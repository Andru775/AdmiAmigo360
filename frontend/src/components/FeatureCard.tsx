interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

export default function FeatureCard({ icon, title, description, details }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 h-full">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {details.map((detail, idx) => (
          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
