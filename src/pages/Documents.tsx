import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Upload, Check } from 'lucide-react';

const Documents = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<{[key: string]: string}>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentDocType, setCurrentDocType] = useState<string>('');

  const applicationId = localStorage.getItem('applicationId');

  const documentTypes = [
    { key: 'aadhaar', label: 'Aadhaar Card', description: 'Front and back side of your Aadhaar card' },
    { key: 'pan', label: 'PAN Card', description: 'Clear image of your PAN card' },
  ];

  const handleFileUpload = async (file: File, docType: string) => {
    if (!user || !applicationId) {
      toast({
        title: "Error",
        description: "Please complete KYC first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${docType}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document record in database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          application_id: applicationId,
          document_type: docType,
          file_path: fileName,
        });

      if (dbError) throw dbError;

      setUploadedDocs(prev => ({ ...prev, [docType]: fileName }));

      toast({
        title: "Success",
        description: `${docType} document uploaded successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerFileUpload = (docType: string) => {
    setCurrentDocType(docType);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentDocType) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      handleFileUpload(file, currentDocType);
    }
  };

  const handleContinue = () => {
    const requiredDocs = documentTypes.map(doc => doc.key);
    const uploadedDocKeys = Object.keys(uploadedDocs);
    
    if (requiredDocs.every(doc => uploadedDocKeys.includes(doc))) {
      navigate('/eligibility');
    } else {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Document Upload</CardTitle>
            <p className="text-muted-foreground">
              Please upload clear images of your identity documents
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {documentTypes.map((docType) => (
              <div key={docType.key} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-lg font-medium">{docType.label}</Label>
                    <p className="text-sm text-muted-foreground">{docType.description}</p>
                  </div>
                  {uploadedDocs[docType.key] && (
                    <div className="flex items-center text-green-600">
                      <Check className="w-5 h-5 mr-1" />
                      <span className="text-sm">Uploaded</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => triggerFileUpload(docType.key)}
                    disabled={loading}
                    className="flex items-center justify-center p-6"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Take Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => triggerFileUpload(docType.key)}
                    disabled={loading}
                    className="flex items-center justify-center p-6"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>
            ))}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              capture="environment"
            />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Important Guidelines:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Ensure documents are clearly visible and not blurred</li>
                <li>• All text should be readable</li>
                <li>• File size should be less than 5MB</li>
                <li>• Supported formats: JPG, PNG</li>
              </ul>
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full"
              disabled={loading || Object.keys(uploadedDocs).length < documentTypes.length}
            >
              Continue to Eligibility Check
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;