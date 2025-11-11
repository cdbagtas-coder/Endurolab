import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { 
  Upload, 
  FileText, 
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Shield,
  FileCheck,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface UploadedFile {
  id: string;
  type: 'id' | 'license' | 'inspection';
  name: string;
  url: string;
}

interface RentalOnboardingProps {
  rentalInfo: any;
  onBack: () => void;
  onComplete: (data: any) => void;
}

export function RentalOnboarding({ rentalInfo, onBack, onComplete }: RentalOnboardingProps) {
  const [step, setStep] = useState<'documents' | 'contract' | 'inspection'>('documents');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [signatureData, setSignatureData] = useState<string>('');
  const [agreementsAccepted, setAgreementsAccepted] = useState({
    terms: false,
    liability: false,
    damage: false,
    age: false
  });
  const [inspectionPhotos, setInspectionPhotos] = useState<string[]>([]);
  const [inspectionChecklist, setInspectionChecklist] = useState({
    bodywork: false,
    tires: false,
    brakes: false,
    lights: false,
    fluids: false,
    controls: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleFileUpload = (type: 'id' | 'license', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate file upload
    const reader = new FileReader();
    reader.onloadend = () => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        name: file.name,
        url: reader.result as string
      };
      setUploadedFiles(prev => [...prev.filter(f => f.type !== type), newFile]);
      toast.success(`${type === 'id' ? 'ID' : 'License'} uploaded successfully`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleInspectionPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setInspectionPhotos(prev => [...prev, reader.result as string]);
      toast.success('Inspection photo added');
    };
    reader.readAsDataURL(file);
  };

  // Signature Canvas Functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
  };

  const canProceedFromDocuments = () => {
    return uploadedFiles.some(f => f.type === 'id') && uploadedFiles.some(f => f.type === 'license');
  };

  const canProceedFromContract = () => {
    return Object.values(agreementsAccepted).every(v => v) && signatureData;
  };

  const canComplete = () => {
    return Object.values(inspectionChecklist).every(v => v) && inspectionPhotos.length >= 4;
  };

  const handleComplete = () => {
    if (!canComplete()) {
      toast.error('Please complete all inspection items');
      return;
    }

    const onboardingData = {
      documents: uploadedFiles,
      signature: signatureData,
      agreements: agreementsAccepted,
      inspection: {
        checklist: inspectionChecklist,
        photos: inspectionPhotos
      },
      completedAt: new Date().toISOString()
    };

    toast.success('Rental onboarding completed! Proceeding to payment...');
    onComplete(onboardingData);
  };

  const getProgressPercentage = () => {
    if (step === 'documents') return 33;
    if (step === 'contract') return 66;
    return 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white">Rental Onboarding</h1>
              <p className="text-sm text-slate-400">
                {step === 'documents' && 'Upload required documents'}
                {step === 'contract' && 'Review and sign agreement'}
                {step === 'inspection' && 'Pre-ride inspection'}
              </p>
            </div>
          </div>
          
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Step 1: Documents */}
        {step === 'documents' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Required Documentation</CardTitle>
                <CardDescription className="text-slate-400">
                  Upload valid ID and driver's license for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Valid ID Upload */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Valid Government ID</Label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('id', e)}
                      className="hidden"
                      id="id-upload"
                    />
                    <label htmlFor="id-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-300 text-sm">Click to upload ID</p>
                      <p className="text-slate-500 text-xs mt-1">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                  {uploadedFiles.find(f => f.type === 'id') && (
                    <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-teal-400" />
                        <span className="text-white text-sm">
                          {uploadedFiles.find(f => f.type === 'id')?.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(uploadedFiles.find(f => f.type === 'id')!.id)}
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator className="bg-slate-700" />

                {/* Driver's License Upload */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Driver's License</Label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('license', e)}
                      className="hidden"
                      id="license-upload"
                    />
                    <label htmlFor="license-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-300 text-sm">Click to upload license</p>
                      <p className="text-slate-500 text-xs mt-1">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                  {uploadedFiles.find(f => f.type === 'license') && (
                    <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-teal-400" />
                        <span className="text-white text-sm">
                          {uploadedFiles.find(f => f.type === 'license')?.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(uploadedFiles.find(f => f.type === 'license')!.id)}
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="text-sm text-slate-300">
                      Your documents are securely encrypted and will only be used for rental verification purposes.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => setStep('contract')}
              disabled={!canProceedFromDocuments()}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
            >
              Continue to Contract
            </Button>
          </div>
        )}

        {/* Step 2: Contract Signing */}
        {step === 'contract' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Rental Agreement</CardTitle>
                <CardDescription className="text-slate-400">
                  Please review and accept all terms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contract Terms */}
                <ScrollArea className="h-64 bg-slate-900 rounded-lg border border-slate-700 p-4">
                  <div className="text-slate-300 text-sm space-y-3">
                    <h3 className="text-white">DIRT BIKE RENTAL AGREEMENT</h3>
                    <p>
                      This Rental Agreement ("Agreement") is entered into between ENDURO LAB ("Owner") 
                      and the undersigned renter ("Renter") for the rental of the motorcycle described herein.
                    </p>
                    
                    <h4 className="text-white mt-4">1. RENTAL PERIOD</h4>
                    <p>
                      The rental period begins on {rentalInfo?.startDate?.toLocaleDateString()} at {rentalInfo?.pickupTime} 
                      and ends on {rentalInfo?.endDate?.toLocaleDateString()} at {rentalInfo?.returnTime}.
                    </p>

                    <h4 className="text-white mt-4">2. RENTAL FEES</h4>
                    <p>
                      Total rental fee: ₱{rentalInfo?.totalCost?.toLocaleString()}<br />
                      Security deposit: ₱10,000 (refundable upon return in good condition)
                    </p>

                    <h4 className="text-white mt-4">3. RENTER'S RESPONSIBILITIES</h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Operate the motorcycle safely and legally</li>
                      <li>Perform daily safety checks before riding</li>
                      <li>Report any damage or mechanical issues immediately</li>
                      <li>Return the motorcycle in the same condition as received</li>
                      <li>Not allow unauthorized persons to operate the motorcycle</li>
                    </ul>

                    <h4 className="text-white mt-4">4. INSURANCE & LIABILITY</h4>
                    <p>
                      Renter acknowledges that they are responsible for any damage to the motorcycle during 
                      the rental period. Basic insurance is included, but renter is liable for the deductible 
                      amount of ₱5,000 in case of damage.
                    </p>

                    <h4 className="text-white mt-4">5. PROHIBITED USES</h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Racing or competitive events without prior approval</li>
                      <li>Operating under the influence of alcohol or drugs</li>
                      <li>Subleasing or lending to third parties</li>
                      <li>Using for illegal activities</li>
                    </ul>

                    <h4 className="text-white mt-4">6. TERMINATION</h4>
                    <p>
                      Owner reserves the right to terminate this agreement immediately if renter violates 
                      any terms or operates the motorcycle unsafely.
                    </p>
                  </div>
                </ScrollArea>

                <Separator className="bg-slate-700" />

                {/* Checkboxes for Agreements */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={agreementsAccepted.terms}
                      onCheckedChange={(checked) => 
                        setAgreementsAccepted(prev => ({ ...prev, terms: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer">
                      I have read and agree to all terms and conditions of this rental agreement
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="liability"
                      checked={agreementsAccepted.liability}
                      onCheckedChange={(checked) => 
                        setAgreementsAccepted(prev => ({ ...prev, liability: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label htmlFor="liability" className="text-sm text-slate-300 cursor-pointer">
                      I accept full liability for any damage or loss during the rental period
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="damage"
                      checked={agreementsAccepted.damage}
                      onCheckedChange={(checked) => 
                        setAgreementsAccepted(prev => ({ ...prev, damage: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label htmlFor="damage" className="text-sm text-slate-300 cursor-pointer">
                      I understand I am responsible for the ₱5,000 deductible for any damage
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="age"
                      checked={agreementsAccepted.age}
                      onCheckedChange={(checked) => 
                        setAgreementsAccepted(prev => ({ ...prev, age: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label htmlFor="age" className="text-sm text-slate-300 cursor-pointer">
                      I confirm I am at least 18 years old and have a valid driver's license
                    </label>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* Signature Pad */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Digital Signature</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSignature}
                      className="text-slate-400 hover:text-white"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="border-2 border-slate-700 rounded-lg bg-white">
                    <canvas
                      ref={signatureCanvasRef}
                      width={400}
                      height={200}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full cursor-crosshair rounded-lg"
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">Sign above using your mouse or finger</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('documents')}
                className="flex-1 bg-slate-900 border-slate-600 text-white hover:bg-slate-800"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep('inspection')}
                disabled={!canProceedFromContract()}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
              >
                Continue to Inspection
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Pre-Ride Inspection */}
        {step === 'inspection' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Pre-Ride Safety Inspection</CardTitle>
                <CardDescription className="text-slate-400">
                  Document the bike's condition before riding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Inspection Checklist */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Safety Checklist</Label>
                  <div className="space-y-2">
                    {Object.entries(inspectionChecklist).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3 bg-slate-900 rounded-lg p-3">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => 
                            setInspectionChecklist(prev => ({ ...prev, [key]: checked as boolean }))
                          }
                        />
                        <label htmlFor={key} className="text-sm text-slate-300 cursor-pointer flex-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {value && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* Photo Documentation */}
                <div className="space-y-3">
                  <Label className="text-slate-300">
                    Inspection Photos (Minimum 4 required)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {inspectionPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square bg-slate-900 rounded-lg overflow-hidden">
                        <img src={photo} alt={`Inspection ${index + 1}`} className="w-full h-full object-cover" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={() => setInspectionPhotos(prev => prev.filter((_, i) => i !== index))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {inspectionPhotos.length < 8 && (
                      <div className="aspect-square border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center hover:border-teal-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleInspectionPhoto}
                          className="hidden"
                          id={`inspection-photo-${inspectionPhotos.length}`}
                        />
                        <label 
                          htmlFor={`inspection-photo-${inspectionPhotos.length}`}
                          className="cursor-pointer text-center p-4"
                        >
                          <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-400 text-xs">Add Photo</p>
                        </label>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Capture front, rear, both sides, and any existing damage
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div className="text-sm text-slate-300">
                      These photos will be used to verify the bike's condition upon return. 
                      Please document any existing scratches or damage.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('contract')}
                className="flex-1 bg-slate-900 border-slate-600 text-white hover:bg-slate-800"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!canComplete()}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
              >
                Complete Onboarding
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
