import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

export default function OrderTimeline({ history = [], currentStatus }) {
  const { t } = useTranslation();
  const steps = ['created', 'confirmed', 'dispatched', 'delivered', 'completed'];
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 py-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const stepData = history.find(h => h.status === step);

        return (
          <div key={step} className="relative pl-8">
            <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 ${
              isCompleted ? 'bg-green-500 border-green-500' : 
              isCurrent ? 'bg-white border-primary-600 animate-pulse' : 
              'bg-white border-gray-300'
            } flex items-center justify-center`}>
              {isCompleted && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
              <h4 className={`font-bold text-lg ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {t(`orders.timeline.${step}`)}
              </h4>
              {stepData && <p className="text-sm text-gray-500">{stepData.timestamp}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
