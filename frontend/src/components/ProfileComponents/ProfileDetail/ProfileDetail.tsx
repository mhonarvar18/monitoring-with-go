import { MdEdit, MdCheck, MdClose } from "react-icons/md";
import type { UserInfo } from "../../../services/userInfo.service";
import Button from "../../Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toPersianDigits } from "../../../utils/numberConvert";

interface Props {
  user: UserInfo;
  // Optionally pass update handler
  onUpdate?: (updatedUser: Partial<UserInfo>) => void;
}

export function ProfileDetails({ user, onUpdate }: Props) {
  // Track which field is being edited
  const [editingField, setEditingField] = useState<keyof UserInfo | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

  const rows: Array<
    [label: string, value: string | null, field: keyof UserInfo]
  > = [
    ["نام و نام خانوادگی", user.fullname, "fullname"],
    ["شماره موبایل", user.phoneNumber, "phoneNumber"],
    ["کد ملی", user.nationalityCode, "nationalityCode"],
    ["نام پدر", user.fatherName, "fatherName"],
    ["آدرس", user.address, "address"],
  ];

  const handleEditClick = (field: keyof UserInfo, value: string | null) => {
    setEditingField(field);
    setEditedValue(value ?? "");
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditedValue("");
  };

  const handleSave = () => {
    if (editingField && onUpdate) {
      onUpdate({ [editingField]: editedValue });
    }
    setEditingField(null);
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
          مشخصات فردی
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rows.map(([label, value, field]) => {
          const isEditing = editingField === field;
          const isAddress = field === "address";

          return (
            <motion.div
              key={field}
              className={`${
                isAddress ? "lg:col-span-2" : ""
              } group relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 rounded-2xl border border-slate-200/50 shadow hover:shadow-md transition-all duration-300 hover:border-slate-300/50`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                <div className={`flex ${isAddress ? "flex-col gap-4" : "flex-row justify-between items-center"} w-full`}>
                  
                  {/* Field Content */}
                  <div className={`flex ${isAddress ? "flex-col gap-3" : "flex-row items-center gap-4"} flex-1`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-500 min-w-fit">
                        {label}
                      </span>
                      {!isAddress && (
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1" onKeyDown={(e) => e.key === 'Enter' && handleSave()}>
                      <AnimatePresence initial={false} mode="wait">
                        {isEditing ? (
                          <motion.input
                            key="input"
                            type="text"
                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-inner text-slate-700 placeholder-slate-400"
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                            autoFocus
                            placeholder={`${label} را وارد کنید`}
                          />
                        ) : (
                          <motion.div
                            key="text"
                            className="cursor-pointer group/text"
                            onClick={() => handleEditClick(field, value)}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <p className="text-slate-700 font-medium text-lg group-hover/text:text-blue-600 transition-colors duration-200 min-h-[28px] flex items-center">
                              {toPersianDigits(value) || (
                                <span className="text-slate-400 italic">
                                  اطلاعات وارد نشده
                                </span>
                              )}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center items-center gap-2">
                    {isEditing ? (
                      <div className="flex gap-2 mr-2">
                        <Button
                          onClick={handleSave}
                          className="group/btn relative overflow-hidden p-3 border-2 border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                          <MdCheck 
                            color="#059669" 
                            size={20}
                            className="group-hover/btn:scale-110 transition-transform duration-200"
                          />
                        </Button>
                        <Button
                          onClick={handleCancel}
                          className="group/btn relative overflow-hidden p-3 border-2 border-red-200 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 hover:border-red-300 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                          <MdClose 
                            color="#DC2626" 
                            size={20}
                            className="group-hover/btn:scale-110 transition-transform duration-200"
                          />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleEditClick(field, value)}
                        className="group/btn relative overflow-hidden p-3 border-2 border-cyan-200 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 hover:border-cyan-300 transition-all duration-200 hover:shadow-lg transform hover:scale-105 opacity-0 group-hover:opacity-100"
                      >
                        <MdEdit 
                          color="#0891b2" 
                          size={20}
                          className="group-hover/btn:scale-110 transition-transform duration-200"
                        />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-100/20 pointer-events-none"></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}