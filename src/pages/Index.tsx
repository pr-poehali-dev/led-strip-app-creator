import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Zone {
  id: string;
  name: string;
  color: string;
  brightness: number;
  isOn: boolean;
  effect: string;
}

interface Scene {
  id: string;
  name: string;
  icon: string;
}

interface Schedule {
  id: string;
  time: string;
  action: string;
  enabled: boolean;
}

const effects = [
  { id: 'static', name: 'Статика', icon: 'Circle' },
  { id: 'wave', name: 'Волна', icon: 'Waves' },
  { id: 'pulse', name: 'Пульс', icon: 'Activity' },
  { id: 'rainbow', name: 'Радуга', icon: 'Sparkles' },
  { id: 'strobe', name: 'Строб', icon: 'Zap' }
];

const presetColors = [
  '#8B5CF6', '#D946EF', '#0EA5E9', '#06B6D4',
  '#10B981', '#F59E0B', '#EF4444', '#FFFFFF'
];

const Index = () => {
  const [zones, setZones] = useState<Zone[]>([
    { id: '1', name: 'Гостиная', color: '#8B5CF6', brightness: 80, isOn: true, effect: 'static' },
    { id: '2', name: 'Спальня', color: '#D946EF', brightness: 50, isOn: false, effect: 'pulse' },
    { id: '3', name: 'Кухня', color: '#0EA5E9', brightness: 100, isOn: true, effect: 'static' }
  ]);

  const [scenes] = useState<Scene[]>([
    { id: '1', name: 'Вечер', icon: 'Moon' },
    { id: '2', name: 'Вечеринка', icon: 'Music' },
    { id: '3', name: 'Работа', icon: 'Laptop' },
    { id: '4', name: 'Релакс', icon: 'CloudMoon' }
  ]);

  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: '1', time: '07:00', action: 'Включить', enabled: true },
    { id: '2', time: '23:00', action: 'Выключить', enabled: true }
  ]);

  const toggleZone = (id: string) => {
    setZones(zones.map(zone => 
      zone.id === id ? { ...zone, isOn: !zone.isOn } : zone
    ));
    toast.success('Зона обновлена');
  };

  const updateZoneBrightness = (id: string, brightness: number) => {
    setZones(zones.map(zone => 
      zone.id === id ? { ...zone, brightness } : zone
    ));
  };

  const updateZoneColor = (id: string, color: string) => {
    setZones(zones.map(zone => 
      zone.id === id ? { ...zone, color } : zone
    ));
  };

  const updateZoneEffect = (id: string, effect: string) => {
    setZones(zones.map(zone => 
      zone.id === id ? { ...zone, effect } : zone
    ));
    toast.success('Эффект применён');
  };

  const applyScene = (sceneName: string) => {
    toast.success(`Сцена "${sceneName}" активирована`);
  };

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#0F1419] to-[#1A1F2C] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue bg-clip-text text-transparent mb-2">
            LED Control
          </h1>
          <p className="text-muted-foreground">Управление умным освещением</p>
        </div>

        <Tabs defaultValue="zones" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="zones" className="data-[state=active]:bg-primary/20">
              <Icon name="Grid3x3" className="mr-2" size={18} />
              Зоны
            </TabsTrigger>
            <TabsTrigger value="scenes" className="data-[state=active]:bg-primary/20">
              <Icon name="Palette" className="mr-2" size={18} />
              Сцены
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-primary/20">
              <Icon name="Clock" className="mr-2" size={18} />
              Расписание
            </TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-4">
            {zones.map((zone) => (
              <Card 
                key={zone.id} 
                className="p-6 bg-card/60 backdrop-blur-md border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full animate-glow-pulse transition-all duration-300"
                      style={{ 
                        backgroundColor: zone.isOn ? zone.color : '#374151',
                        opacity: zone.isOn ? zone.brightness / 100 : 0.3
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{zone.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {effects.find(e => e.id === zone.effect)?.name}
                      </Badge>
                    </div>
                  </div>
                  <Switch 
                    checked={zone.isOn} 
                    onCheckedChange={() => toggleZone(zone.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {zone.isOn && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Яркость</label>
                        <span className="text-sm text-muted-foreground">{zone.brightness}%</span>
                      </div>
                      <Slider
                        value={[zone.brightness]}
                        onValueChange={(val) => updateZoneBrightness(zone.id, val[0])}
                        max={100}
                        step={1}
                        className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Цвет</label>
                      <div className="grid grid-cols-8 gap-2">
                        {presetColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => updateZoneColor(zone.id, color)}
                            className={`w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 ${
                              zone.color === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Эффекты</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {effects.map((effect) => (
                          <Button
                            key={effect.id}
                            variant={zone.effect === effect.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateZoneEffect(zone.id, effect.id)}
                            className="h-12"
                          >
                            <Icon name={effect.icon} className="mr-2" size={16} />
                            {effect.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="scenes" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {scenes.map((scene) => (
                <Card
                  key={scene.id}
                  className="p-6 bg-card/60 backdrop-blur-md border-border/50 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => applyScene(scene.name)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name={scene.icon} size={32} className="text-primary" />
                    </div>
                    <span className="font-medium text-center">{scene.name}</span>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-card/60 backdrop-blur-md border-border/50 mt-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Icon name="Info" size={20} />
                <p className="text-sm">Нажмите на сцену чтобы активировать предустановленные настройки освещения</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            {schedules.map((schedule) => (
              <Card 
                key={schedule.id}
                className="p-6 bg-card/60 backdrop-blur-md border-border/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon name="Clock" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{schedule.time}</h3>
                      <p className="text-sm text-muted-foreground">{schedule.action}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={schedule.enabled}
                    onCheckedChange={() => toggleSchedule(schedule.id)}
                    className="data-[state=checked]:bg-accent"
                  />
                </div>
              </Card>
            ))}

            <Button 
              variant="outline" 
              className="w-full h-14 border-dashed border-2 hover:border-primary hover:bg-primary/10"
            >
              <Icon name="Plus" className="mr-2" size={20} />
              Добавить расписание
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
