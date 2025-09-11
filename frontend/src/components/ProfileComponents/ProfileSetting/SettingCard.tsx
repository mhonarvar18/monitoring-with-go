import React from "react";
import { TrashIcon } from "../../../assets/icons/TrashIcon";
import { EditIcon } from "../../../assets/icons/EditIcon";
import type { UserSetting } from "../../../services/userSetting.service";
import { toPersianDigits } from "../../../utils/numberConvert";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

interface Props {
  setting: UserSetting;
  onEdit: (id: string | number) => void;
  onDelete: (id: string) => void;
}

export function SettingCard({ setting, onEdit, onDelete }: Props) {
  const { alarmCategory, alarmColor, audioUrl, id } = setting;
  
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-slate-200/50 transition-all duration-500 transform hover:-translate-y-2">
      {/* Animated border accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
        style={{ backgroundColor: alarmColor }}
      />
      
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
        style={{ backgroundColor: alarmColor }}
      />
      
      <div className="relative z-10 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full shadow-lg animate-pulse"
                style={{ backgroundColor: alarmColor }}
              />
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                {alarmCategory.label}
              </h3>
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-slate-300 to-transparent rounded-full" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={() => onEdit(id)}
              className="group/btn relative overflow-hidden p-3 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-2 border-amber-200 hover:border-amber-300 rounded-2xl transition-all duration-200 hover:shadow-lg transform hover:scale-110"
            >
              <FaEdit className="w-4 h-4 text-amber-600 group-hover/btn:text-amber-700 transition-colors" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="group/btn relative overflow-hidden p-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-2 border-red-200 hover:border-red-300 rounded-2xl transition-all duration-200 hover:shadow-lg transform hover:scale-110"
            >
              <FaTrash className="w-4 h-4 text-red-600 group-hover/btn:text-red-700 transition-colors" />
            </button>
          </div>
        </div>

        {/* Audio Info Section */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4 mb-6 border border-slate-200/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full" />
              <p className="font-semibold text-slate-600 text-sm">صدا هشدار</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              audioUrl 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {audioUrl ? `${toPersianDigits('صدا 1')}` : "ندارد"}
            </span>
          </div>
        </div>

        {/* Color Preview Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">رنگ هشدار</span>
            <div 
              className="w-6 h-6 rounded-lg shadow-inner border-2 border-white"
              style={{ backgroundColor: alarmColor }}
            />
          </div>
          
          {/* Color Bar */}
          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 rounded-full shadow-inner transition-all duration-500 group-hover:shadow-lg"
              style={{ backgroundColor: alarmColor }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/10 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Subtle corner decoration */}
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div 
          className="w-full h-full rounded-tl-full"
          style={{ backgroundColor: alarmColor }}
        />
      </div>
    </div>
  );
}