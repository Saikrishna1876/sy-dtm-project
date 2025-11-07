'use client';

import { GateType } from '@/lib/types';
import {
  Zap,
  ToggleLeft,
  Lightbulb,
  CircleDot,
  Layers
} from 'lucide-react';

interface ComponentItem {
  type: GateType;
  label: string;
  icon: React.ReactNode;
}

const components: { category: string; items: ComponentItem[] }[] = [
  {
    category: 'Inputs',
    items: [
      { type: 'INPUT', label: 'Input Switch', icon: <ToggleLeft className="w-4 h-4" /> },
    ],
  },
  {
    category: 'Logic Gates',
    items: [
      { type: 'AND', label: 'AND Gate', icon: <Zap className="w-4 h-4" /> },
      { type: 'OR', label: 'OR Gate', icon: <Zap className="w-4 h-4" /> },
      { type: 'NOT', label: 'NOT Gate', icon: <Zap className="w-4 h-4" /> },
      { type: 'NAND', label: 'NAND Gate', icon: <CircleDot className="w-4 h-4" /> },
      { type: 'NOR', label: 'NOR Gate', icon: <CircleDot className="w-4 h-4" /> },
      { type: 'XOR', label: 'XOR Gate', icon: <Layers className="w-4 h-4" /> },
      { type: 'XNOR', label: 'XNOR Gate', icon: <Layers className="w-4 h-4" /> },
    ],
  },
  {
    category: 'Outputs',
    items: [
      { type: 'OUTPUT', label: 'Output LED', icon: <Lightbulb className="w-4 h-4" /> },
    ],
  },
];

export default function ComponentPalette() {
  const onDragStart = (event: React.DragEvent, gateType: GateType) => {
    event.dataTransfer.setData('application/reactflow', gateType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Components</h2>

      {components.map((section) => (
        <div key={section.category} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            {section.category}
          </h3>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => onDragStart(e, item.type)}
                className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg cursor-move hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="text-blue-600">{item.icon}</div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
