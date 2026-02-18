interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  image?: string;
}

export default function TeamMember({ name, role, description, image }: TeamMemberProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Placeholder Avatar */}
      <div className="bg-gradient-to-br from-blue-900 to-green-600 h-48 flex items-center justify-center">
        <div className="text-6xl text-white">{name.charAt(0)}</div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <p className="text-red-500 font-semibold mb-3">{role}</p>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
