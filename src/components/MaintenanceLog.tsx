import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { 
  Wrench, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Camera,
  FileText,
  ArrowLeft,
  Clock,
  TrendingUp,
  Shield,
  X
} from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  technician: string;
  cost?: number;
  partsReplaced?: string[];
  status: 'completed' | 'scheduled';
}

interface IssueReport {
  id: string;
  reportedDate: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  photos: string[];
  status: 'pending' | 'acknowledged' | 'resolved';
}

interface MaintenanceLogProps {
  bikeId: string;
  bikeName: string;
  onBack: () => void;
}

export function MaintenanceLog({ bikeId, bikeName, onBack }: MaintenanceLogProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'report'>('history');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueSeverity, setIssueSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [issuePhotos, setIssuePhotos] = useState<string[]>([]);

  // Mock maintenance history
  const maintenanceHistory: MaintenanceRecord[] = [
    {
      id: 'M001',
      date: '2025-10-15',
      type: 'routine',
      description: 'Regular service - Oil change, air filter replacement, chain lubrication',
      technician: 'Carlos Rodriguez',
      cost: 2500,
      partsReplaced: ['Engine Oil', 'Oil Filter', 'Air Filter'],
      status: 'completed'
    },
    {
      id: 'M002',
      date: '2025-10-10',
      type: 'inspection',
      description: 'Pre-rental safety inspection',
      technician: 'Miguel Santos',
      status: 'completed'
    },
    {
      id: 'M003',
      date: '2025-10-05',
      type: 'repair',
      description: 'Front brake pad replacement and rotor resurfacing',
      technician: 'Carlos Rodriguez',
      cost: 3800,
      partsReplaced: ['Front Brake Pads', 'Brake Fluid'],
      status: 'completed'
    },
    {
      id: 'M004',
      date: '2025-09-28',
      type: 'routine',
      description: 'Chain and sprocket replacement, suspension check',
      technician: 'Juan Dela Cruz',
      cost: 8500,
      partsReplaced: ['Chain', 'Front Sprocket', 'Rear Sprocket'],
      status: 'completed'
    },
    {
      id: 'M005',
      date: '2025-09-20',
      type: 'inspection',
      description: '500km service inspection',
      technician: 'Miguel Santos',
      status: 'completed'
    },
    {
      id: 'M006',
      date: '2025-10-25',
      type: 'routine',
      description: 'Scheduled maintenance after rental return',
      technician: 'TBD',
      status: 'scheduled'
    }
  ];

  // Mock issue reports
  const issueReports: IssueReport[] = [
    {
      id: 'ISS001',
      reportedDate: '2025-10-18',
      description: 'Minor scratch on left side panel from trail debris',
      severity: 'low',
      photos: ['https://images.unsplash.com/photo-1558980664-769d59546b3d?w=300'],
      status: 'acknowledged'
    }
  ];

  const bikeStats = {
    totalServices: 12,
    lastService: '5 days ago',
    nextService: '25 days',
    healthScore: 95,
    totalMileage: 2450
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setIssuePhotos(prev => [...prev, reader.result as string]);
      toast.success('Photo added');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index: number) => {
    setIssuePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReport = () => {
    if (!issueDescription.trim()) {
      toast.error('Please describe the issue');
      return;
    }

    if (issuePhotos.length === 0) {
      toast.error('Please add at least one photo');
      return;
    }

    toast.success('Issue reported successfully!', {
      description: 'Our team will review it shortly'
    });

    setIssueDescription('');
    setIssuePhotos([]);
    setIssueSeverity('medium');
    setActiveTab('history');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'routine': return 'bg-blue-500';
      case 'repair': return 'bg-orange-500';
      case 'inspection': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'scheduled': return 'text-blue-400';
      case 'acknowledged': return 'text-yellow-400';
      case 'resolved': return 'text-green-400';
      case 'pending': return 'text-orange-400';
      default: return 'text-slate-400';
    }
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
            <div className="flex-1">
              <h1 className="text-white">Maintenance Log</h1>
              <p className="text-sm text-slate-400">{bikeName}</p>
            </div>
            <Shield className="w-6 h-6 text-teal-400" />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === 'history'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Service History
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === 'report'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Report Issue
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* Bike Health Overview */}
            <Card className="bg-gradient-to-r from-teal-500 to-teal-600 border-none text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Overall Health Score</p>
                    <p className="text-4xl">{bikeStats.healthScore}%</p>
                  </div>
                  <TrendingUp className="w-12 h-12 opacity-50" />
                </div>
                <Progress value={bikeStats.healthScore} className="h-2 bg-white/20" />
                <p className="text-xs mt-2 opacity-75">Excellent condition - Well maintained</p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-500/20 rounded-full p-2">
                      <Wrench className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total Services</p>
                      <p className="text-xl text-white">{bikeStats.totalServices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 rounded-full p-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Last Service</p>
                      <p className="text-xl text-white">{bikeStats.lastService}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 rounded-full p-2">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Next Service</p>
                      <p className="text-xl text-white">{bikeStats.nextService}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 rounded-full p-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Mileage</p>
                      <p className="text-xl text-white">{bikeStats.totalMileage}km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Maintenance History */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Service History</CardTitle>
                <CardDescription className="text-slate-400">
                  Complete maintenance records for transparency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceHistory.map((record, index) => (
                    <div key={record.id}>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            record.status === 'completed' ? 'bg-teal-500' : 'bg-blue-500'
                          }`}>
                            {record.status === 'completed' ? (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            ) : (
                              <Clock className="w-6 h-6 text-white" />
                            )}
                          </div>
                          {index < maintenanceHistory.length - 1 && (
                            <div className="w-0.5 h-full min-h-16 bg-slate-700 mt-2" />
                          )}
                        </div>

                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={`${getTypeColor(record.type)} text-white border-none text-xs`}>
                                  {record.type}
                                </Badge>
                                <span className={`text-sm ${getStatusColor(record.status)}`}>
                                  {record.status}
                                </span>
                              </div>
                              <h4 className="text-white text-sm">{record.description}</h4>
                            </div>
                            <span className="text-xs text-slate-500">
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="space-y-1 text-xs text-slate-400">
                            <p>Technician: {record.technician}</p>
                            {record.partsReplaced && record.partsReplaced.length > 0 && (
                              <p>Parts: {record.partsReplaced.join(', ')}</p>
                            )}
                            {record.cost && (
                              <p className="text-teal-400">Cost: ₱{record.cost.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reported Issues */}
            {issueReports.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Reported Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {issueReports.map((issue) => (
                    <div key={issue.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${getSeverityColor(issue.severity)} text-white border-none text-xs`}>
                              {issue.severity} priority
                            </Badge>
                            <span className={`text-xs ${getStatusColor(issue.status)}`}>
                              {issue.status}
                            </span>
                          </div>
                          <p className="text-white text-sm">{issue.description}</p>
                        </div>
                      </div>
                      
                      {issue.photos.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {issue.photos.map((photo, idx) => (
                            <ImageWithFallback
                              key={idx}
                              src={photo}
                              alt={`Issue ${idx + 1}`}
                              className="w-16 h-16 rounded object-cover"
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-slate-500 mt-3">
                        Reported: {new Date(issue.reportedDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Report Issue Tab */}
        {activeTab === 'report' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Report an Issue</CardTitle>
                <CardDescription className="text-slate-400">
                  Document any damage or mechanical problems immediately
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Severity Selection */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Issue Severity</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((severity) => (
                      <button
                        key={severity}
                        onClick={() => setIssueSeverity(severity)}
                        className={`px-4 py-3 rounded-lg text-sm transition-colors ${
                          issueSeverity === severity
                            ? getSeverityColor(severity) + ' text-white'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    placeholder="Describe the issue in detail... (e.g., location, when it occurred, severity)"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    rows={6}
                    className="bg-slate-900 border-slate-600 text-white resize-none"
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Photos (Required)</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {issuePhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square bg-slate-900 rounded-lg overflow-hidden">
                        <img src={photo} alt={`Issue ${index + 1}`} className="w-full h-full object-cover" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {issuePhotos.length < 6 && (
                      <div className="aspect-square border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center hover:border-teal-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id={`issue-photo-${issuePhotos.length}`}
                        />
                        <label 
                          htmlFor={`issue-photo-${issuePhotos.length}`}
                          className="cursor-pointer text-center p-4"
                        >
                          <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-400 text-xs">Add Photo</p>
                        </label>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Take clear photos showing the damage or issue from multiple angles
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <div className="text-sm text-slate-300">
                      <p className="text-white mb-1">Important:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Report issues immediately when discovered</li>
                        <li>Photos are required for all damage claims</li>
                        <li>Our team will review within 24 hours</li>
                        <li>You may be contacted for additional information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitReport}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Submit Issue Report
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
