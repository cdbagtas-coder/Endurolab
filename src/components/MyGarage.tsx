import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Bike, Plus, Trash2, Check } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export interface SavedBike {
  id: string;
  make: string;
  model: string;
  year: string;
  nickname?: string;
}

interface MyGarageProps {
  savedBikes: SavedBike[];
  onAddBike: (bike: SavedBike) => void;
  onRemoveBike: (id: string) => void;
  onSelectBike: (bike: SavedBike | null) => void;
  selectedBike: SavedBike | null;
}

const BIKE_MAKES = ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'KTM', 'Husqvarna', 'Beta', 'GasGas', 'Sherco', 'TM Racing', 'Ducati', 'Triumph', 'Fantic'];
const YEARS = Array.from({ length: 25 }, (_, i) => (2025 - i).toString());

const MODELS_BY_MAKE: Record<string, string[]> = {
  'Honda': ['CRF450R', 'CRF250R', 'CRF450X', 'CRF300L'],
  'Yamaha': ['YZ450F', 'YZ250F', 'WR450F', 'YZ125'],
  'Kawasaki': ['KX450', 'KX250', 'KX450X', 'KLX300R', 'KX112', 'KX85'],
  'Suzuki': ['RMZ450', 'RMZ250', 'RM85', 'DRZ400'],
  'KTM': ['450 SX-F', '250 SX-F', '350 EXC-F', '300 XC'],
  'Husqvarna': ['FC 450', 'FC 250', 'TE 300i', 'FE 501'],
  'Beta': ['RR 300', 'RR 430', 'Xtrainer 300', 'RR 480'],
  'GasGas': ['EC 300', 'MC 450F', 'EC 250F', 'XC 300'],
  'Sherco': ['SE 300', 'SEF 450', 'SE-R 300', 'SEF 250'],
  'TM Racing': ['EN 300', 'SMX 450Fi', 'EN 250', 'SMR 300'],
  'Ducati': ['Desmo450MX'],
  'Triumph': ['TF250-X', 'TF450-RC'],
  'Fantic': ['XE300', 'XX250', 'XEF250', 'XMF250']
};

export function MyGarage({ savedBikes, onAddBike, onRemoveBike, onSelectBike, selectedBike }: MyGarageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newBike, setNewBike] = useState({ make: '', model: '', year: '' });

  const handleAddBike = () => {
    if (newBike.make && newBike.model && newBike.year) {
      onAddBike({
        id: Date.now().toString(),
        ...newBike
      });
      setNewBike({ make: '', model: '', year: '' });
    }
  };

  const availableModels = newBike.make ? MODELS_BY_MAKE[newBike.make] || [] : [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:border-teal-500"
        >
          <Bike className="w-4 h-4 mr-2" />
          My Garage
          {savedBikes.length > 0 && (
            <Badge className="ml-2 bg-teal-500 text-white border-none">
              {savedBikes.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">My Garage</DialogTitle>
          <DialogDescription className="text-slate-400">
            Save your bikes for instant compatibility checks when browsing parts
          </DialogDescription>
        </DialogHeader>

        {/* Saved Bikes List */}
        <div className="space-y-3 my-4">
          {savedBikes.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center text-slate-400">
                No bikes saved yet. Add your first bike below!
              </CardContent>
            </Card>
          ) : (
            savedBikes.map((bike) => (
              <Card 
                key={bike.id} 
                className={`bg-slate-800 border-slate-700 hover:border-teal-500 transition-all cursor-pointer ${
                  selectedBike?.id === bike.id ? 'border-teal-500 ring-2 ring-teal-500/50' : ''
                }`}
                onClick={() => onSelectBike(selectedBike?.id === bike.id ? null : bike)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <Bike className="w-4 h-4 text-teal-400" />
                        <span className="text-white">
                          {bike.year} {bike.make} {bike.model}
                        </span>
                        {selectedBike?.id === bike.id && (
                          <Check className="w-4 h-4 text-teal-400" />
                        )}
                      </div>
                      {bike.nickname && (
                        <p className="text-sm text-slate-400 ml-6">{bike.nickname}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBike(bike.id);
                        if (selectedBike?.id === bike.id) {
                          onSelectBike(null);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add New Bike Form */}
        <div className="border-t border-slate-700 pt-4 space-y-4">
          <h3 className="text-white">Add New Bike</h3>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Make</Label>
            <Select value={newBike.make} onValueChange={(value) => setNewBike({ ...newBike, make: value, model: '' })}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {BIKE_MAKES.map((make) => (
                  <SelectItem key={make} value={make} className="text-white focus:bg-slate-700 focus:text-white">
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Model</Label>
            <Select 
              value={newBike.model} 
              onValueChange={(value) => setNewBike({ ...newBike, model: value })}
              disabled={!newBike.make}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white disabled:opacity-50">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {availableModels.map((model) => (
                  <SelectItem key={model} value={model} className="text-white focus:bg-slate-700 focus:text-white">
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Year</Label>
            <Select value={newBike.year} onValueChange={(value) => setNewBike({ ...newBike, year: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[200px]">
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year} className="text-white focus:bg-slate-700 focus:text-white">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            onClick={handleAddBike}
            disabled={!newBike.make || !newBike.model || !newBike.year}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Garage
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
