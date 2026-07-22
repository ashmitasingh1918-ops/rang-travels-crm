/**
 * Stepper.jsx
 * Professional horizontal progress pill bar.
 */
import React from "react";
import { Check } from "lucide-react";

export default function Stepper({ current, steps = [], onStepClick }) {
  return (
    <div className="d-flex align-items-center flex-wrap gap-2 py-2 overflow-auto">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = current === stepNum;
        const isDone = current > stepNum;
        const StepIcon = step.icon;

        return (
          <React.Fragment key={stepNum}>
            {/* Pill Trigger element */}
            <button
              type="button"
              className={`btn d-flex align-items-center gap-2 px-3.5 py-2.5 rounded-full border fs-7 fw-semibold shadow-none transition-click ${
                isActive
                  ? "bg-primary text-white border-primary"
                  : isDone
                  ? "bg-success bg-opacity-10 text-success border-success-subtle"
                  : "bg-white text-secondary border-light-subtle"
              }`}
              onClick={() => onStepClick(stepNum)}
              style={{
                borderRadius: "32px",
                borderColor: isActive ? "#2563EB" : isDone ? "#a7f3d0" : "#cbd5e1"
              }}
              data-testid={`stepper-step-${stepNum}`}
            >
              {isDone ? (
                <Check size={14} className="flex-shrink-0 animate-pulse text-success" />
              ) : (
                <StepIcon size={14} className="flex-shrink-0" />
              )}
              <span>{step.label}</span>
            </button>

            {/* Hair-thin Connector line */}
            {idx < steps.length - 1 && (
              <div
                className="flex-shrink-0 my-auto bg-slate-200"
                style={{ width: "16px", height: "1px" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
