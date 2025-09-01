interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: number;
  image?: string;
  email_id: string;
  created_at?: string;
}

interface SchoolCardProps {
  school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  const formatContact = (contact: number): string => {
    const contactStr = contact.toString();
    return contactStr.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* School Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {school.image ? (
          <img
            src={school.image}
            alt={school.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const nextDiv = target.nextElementSibling as HTMLElement;
              if (nextDiv) nextDiv.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Default placeholder */}
        <div 
          className={`w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${school.image ? 'hidden' : 'flex'}`}
        >
          <div className="text-center text-white">
            <div className="text-4xl mb-2">🏫</div>
            <div className="text-sm font-medium">School Image</div>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
      </div>

      {/* School Information */}
      <div className="p-5">
        {/* School Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {school.name}
        </h3>
        
        {/* School Details */}
        <div className="space-y-2 text-sm">
          {/* Address */}
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5 flex-shrink-0">📍</span>
            <p className="text-gray-600 line-clamp-2 leading-relaxed">
              {school.address}
            </p>
          </div>
          
          {/* City & State */}
          <div className="flex items-center space-x-2">
            <span className="text-green-500 flex-shrink-0">🏙️</span>
            <p className="text-gray-700 font-medium">
              {school.city}, {school.state}
            </p>
          </div>
          
          {/* Contact */}
          <div className="flex items-center space-x-2">
            <span className="text-orange-500 flex-shrink-0">📞</span>
            <p className="text-gray-600">
              {formatContact(school.contact)}
            </p>
          </div>
          
          {/* Email */}
          <div className="flex items-center space-x-2">
            <span className="text-red-500 flex-shrink-0">✉️</span>
            <p className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer text-xs">
              {school.email_id}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}