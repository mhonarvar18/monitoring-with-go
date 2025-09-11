import { CiCircleRemove } from "react-icons/ci";

interface SupportSettingsCardProps {
  title?: string;
  value?: string;
  onTitleChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onDeleteCard?: () => void;
  isSetting?: boolean;
}

const SupportSettingsCard = ({
  title,
  value,
  onTitleChange,
  onValueChange,
  onDeleteCard,
  isSetting = false,
}: SupportSettingsCardProps) => {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 rounded-2xl shadow-lg hover:shadow-xl border-2 border-slate-200/50 hover:border-slate-300/50 transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between gap-6">
          
          {/* Content Section */}
          <div className="flex-1 space-y-4">
            
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                {isSetting ? "نوع تنظیمات" : "عنوان"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full p-4 border-2 rounded-xl outline-none transition-all duration-200 text-slate-700 ${
                    isSetting
                      ? 'bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200 text-slate-600 cursor-not-allowed'
                      : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300'
                  }`}
                  value={isSetting ? "توضیحات" : title}
                  onChange={(e) => !isSetting && onTitleChange?.(e.target.value)}
                  placeholder={isSetting ? "" : "عنوان را وارد کنید"}
                  readOnly={isSetting}
                />
                {isSetting && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Value Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                {isSetting ? "محتوای توضیحات" : "مقدار"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`p-4 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300 transition-all duration-200 bg-white text-slate-700 placeholder-slate-400 ${
                    isSetting ? 'w-full' : 'w-full'
                  }`}
                  placeholder={isSetting ? "توضیحات مورد نظر را وارد کنید" : "شماره / آدرس مورد نظر را وارد کنید"}
                  value={value}
                  onChange={(e) => onValueChange?.(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    value ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-slate-300'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          {!isSetting && onDeleteCard && (
            <div className="flex items-center justify-center pt-8">
              <button 
                onClick={onDeleteCard} 
                className="group/btn relative overflow-hidden p-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-2 border-red-200 hover:border-red-300 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-110 opacity-60 group-hover:opacity-100"
              >
                <CiCircleRemove 
                  size={28} 
                  className="text-red-600 group-hover/btn:text-red-700 transition-colors duration-200" 
                />
              </button>
            </div>
          )}
        </div>

        {/* Card Type Indicator */}
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${
            isSetting 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

export default SupportSettingsCard;