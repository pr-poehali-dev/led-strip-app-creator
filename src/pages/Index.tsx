import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ArtObject {
  id: string;
  name: string;
  type: string;
  chakra?: string;
  color: string;
  brightness: number;
  currentScene: string;
}

interface Scene {
  id: string;
  name: string;
  brightness: number;
  color: string;
}

const chakras = [
  { id: 'root', name: 'Муладхара', color: '#E53E3E', icon: '🔴' },
  { id: 'sacral', name: 'Свадхистана', color: '#F97316', icon: '🟠' },
  { id: 'solar', name: 'Манипура', color: '#F59E0B', icon: '🟡' },
  { id: 'heart', name: 'Анахата', color: '#10B981', icon: '🟢' },
  { id: 'throat', name: 'Вишудха', color: '#0EA5E9', icon: '🔵' },
  { id: 'third', name: 'Аджна', color: '#8B5CF6', icon: '🟣' },
  { id: 'crown', name: 'Сахасрара', color: '#D946EF', icon: '🟣' }
];

const presetScenes = [
  { id: 'meditation', name: 'Медитация', brightness: 50, color: '#8B5CF6' },
  { id: 'energy', name: 'Энергия', brightness: 100, color: '#F59E0B' },
  { id: 'relaxation', name: 'Релаксация', brightness: 30, color: '#10B981' },
  { id: 'ritual', name: 'Ритуал', brightness: 70, color: '#D946EF' }
];

const Index = () => {
  const [artObjects, setArtObjects] = useState<ArtObject[]>([
    { id: '1', name: 'Панно Чакры', type: 'chakra-panel', chakra: 'solar', color: '#F59E0B', brightness: 80, currentScene: 'meditation' },
    { id: '2', name: 'Светильник Лотос', type: 'lamp', color: '#D946EF', brightness: 60, currentScene: 'relaxation' },
    { id: '3', name: 'Инсталляция Мандала', type: 'installation', color: '#10B981', brightness: 90, currentScene: 'energy' }
  ]);

  const [selectedObject, setSelectedObject] = useState<ArtObject | null>(null);
  const [customScenes, setCustomScenes] = useState<Scene[]>([]);
  const [isCreatingScene, setIsCreatingScene] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');

  const openSettings = (obj: ArtObject) => {
    setSelectedObject(obj);
  };

  const closeSettings = () => {
    setSelectedObject(null);
    setIsCreatingScene(false);
    setNewSceneName('');
  };

  const updateBrightness = (brightness: number) => {
    if (!selectedObject) return;
    setArtObjects(artObjects.map(obj =>
      obj.id === selectedObject.id ? { ...obj, brightness } : obj
    ));
    setSelectedObject({ ...selectedObject, brightness });
  };

  const applyScene = (scene: Scene) => {
    if (!selectedObject) return;
    setArtObjects(artObjects.map(obj =>
      obj.id === selectedObject.id
        ? { ...obj, brightness: scene.brightness, color: scene.color, currentScene: scene.id }
        : obj
    ));
    setSelectedObject({ ...selectedObject, brightness: scene.brightness, color: scene.color, currentScene: scene.id });
    toast.success(`Сцена "${scene.name}" применена`);
  };

  const createCustomScene = () => {
    if (!selectedObject || !newSceneName.trim()) return;
    
    const newScene: Scene = {
      id: `custom-${Date.now()}`,
      name: newSceneName,
      brightness: selectedObject.brightness,
      color: selectedObject.color
    };
    
    setCustomScenes([...customScenes, newScene]);
    toast.success(`Сцена "${newSceneName}" создана`);
    setIsCreatingScene(false);
    setNewSceneName('');
  };

  const deleteCustomScene = (sceneId: string) => {
    setCustomScenes(customScenes.filter(s => s.id !== sceneId));
    toast.success('Сцена удалена');
  };

  const updateObjectColor = (color: string) => {
    if (!selectedObject) return;
    setArtObjects(artObjects.map(obj =>
      obj.id === selectedObject.id ? { ...obj, color } : obj
    ));
    setSelectedObject({ ...selectedObject, color });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#0A0D14] to-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Sacrarium LED
          </h1>
          <p className="text-muted-foreground">Управление световыми инсталляциями</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artObjects.map((obj) => (
            <Card
              key={obj.id}
              className="group p-6 bg-card/60 backdrop-blur-md border-border/50 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => openSettings(obj)}
            >
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-6xl animate-energy-flow transition-all duration-300"
                  style={{
                    backgroundColor: obj.color,
                    opacity: obj.brightness / 100,
                    boxShadow: `0 0 40px ${obj.color}80`
                  }}
                >
                  {obj.type === 'chakra-panel' && obj.chakra
                    ? chakras.find(c => c.id === obj.chakra)?.icon
                    : obj.type === 'lamp' ? '🪷' : '✨'}
                </div>
                
                <div className="text-center w-full">
                  <h3 className="text-xl font-semibold mb-2">{obj.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {obj.brightness}% яркость
                  </Badge>
                  {obj.type === 'chakra-panel' && obj.chakra && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {chakras.find(c => c.id === obj.chakra)?.name}
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    openSettings(obj);
                  }}
                >
                  <Icon name="Settings" className="mr-2" size={16} />
                  Настройки
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={selectedObject !== null} onOpenChange={(open) => !open && closeSettings()}>
          <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-border/50">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full animate-glow-pulse"
                  style={{ backgroundColor: selectedObject?.color }}
                />
                {selectedObject?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Яркость</Label>
                  <span className="text-sm text-muted-foreground">{selectedObject?.brightness}%</span>
                </div>
                <Slider
                  value={[selectedObject?.brightness || 0]}
                  onValueChange={(val) => updateBrightness(val[0])}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                />
              </div>

              {selectedObject?.type === 'chakra-panel' && (
                <div>
                  <Label className="mb-3 block">Выбор чакры</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {chakras.map((chakra) => (
                      <button
                        key={chakra.id}
                        onClick={() => updateObjectColor(chakra.color)}
                        className={`aspect-square rounded-lg transition-all duration-200 hover:scale-110 text-2xl flex items-center justify-center ${
                          selectedObject?.color === chakra.color
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
                            : ''
                        }`}
                        style={{ backgroundColor: chakra.color }}
                      >
                        {chakra.icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="mb-3 block">Готовые сцены</Label>
                <div className="grid grid-cols-2 gap-3">
                  {presetScenes.map((scene) => (
                    <Card
                      key={scene.id}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:border-primary/50 ${
                        selectedObject?.currentScene === scene.id ? 'border-primary' : ''
                      }`}
                      onClick={() => applyScene(scene)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: scene.color }}
                        />
                        <div>
                          <p className="font-medium">{scene.name}</p>
                          <p className="text-xs text-muted-foreground">{scene.brightness}%</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {customScenes.length > 0 && (
                <div>
                  <Label className="mb-3 block">Мои сцены</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {customScenes.map((scene) => (
                      <Card
                        key={scene.id}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:border-primary/50 relative ${
                          selectedObject?.currentScene === scene.id ? 'border-primary' : ''
                        }`}
                        onClick={() => applyScene(scene)}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomScene(scene.id);
                          }}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: scene.color }}
                          />
                          <div>
                            <p className="font-medium">{scene.name}</p>
                            <p className="text-xs text-muted-foreground">{scene.brightness}%</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {!isCreatingScene ? (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2"
                  onClick={() => setIsCreatingScene(true)}
                >
                  <Icon name="Plus" className="mr-2" size={20} />
                  Создать свою сцену
                </Button>
              ) : (
                <Card className="p-4 bg-muted/50">
                  <Label className="mb-2 block">Название новой сцены</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSceneName}
                      onChange={(e) => setNewSceneName(e.target.value)}
                      placeholder="Моя сцена..."
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && createCustomScene()}
                    />
                    <Button onClick={createCustomScene} disabled={!newSceneName.trim()}>
                      <Icon name="Check" size={18} />
                    </Button>
                    <Button variant="ghost" onClick={() => setIsCreatingScene(false)}>
                      <Icon name="X" size={18} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Текущая яркость ({selectedObject?.brightness}%) и цвет сохранятся в сцене
                  </p>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
