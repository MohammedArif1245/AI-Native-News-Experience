import { GraduationCap, TrendingUp, Lightbulb } from "lucide-react";

export default function UserTypeSelector({ selected, onSelect }) {
  const userTypes = [
    {
      id: "student",
      label: "Student",
      icon: GraduationCap,
      description: "Simplified explanations",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
    },
    {
      id: "investor",
      label: "Investor",
      icon: TrendingUp,
      description: "Market insights",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
    },
    {
      id: "founder",
      label: "Founder",
      icon: Lightbulb,
      description: "Business angles",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
    },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        I'm a...
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                ${
                  isSelected
                    ? `${type.borderColor} ${type.bgColor} shadow-md`
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  p-2 rounded-lg bg-gradient-to-br ${type.color}
                  ${isSelected ? "shadow-lg" : "opacity-60"}
                `}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-900">
                    {type.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {type.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
