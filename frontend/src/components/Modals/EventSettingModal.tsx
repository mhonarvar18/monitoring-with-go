import Modal from "react-modal";
import FormModal from "./FormModal";
import { createEventSettingSchema } from "../../formSchema/eventSettingSchema";
import { useAlarmCategories } from "../../hooks/useAlarmCategories";
import { useUserInfo } from "../../hooks/useUserInfo";
import type { NewEvent } from "../../hooks/userSettingActions";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { errorStyle } from "../../types/stylesToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: NewEvent, id?: number) => void;
  settings?: any;
  isEdit?: boolean;
}

const EventSettingModal = ({
  isOpen,
  onClose,
  onSubmit,
  settings,
  isEdit,
}: Props) => {
  const { data: alarms } = useAlarmCategories();
  const { userInfo } = useUserInfo();
  const schema = useMemo(
    () => createEventSettingSchema(alarms ?? [], isEdit ?? false),
    [alarms]
  );

  const handleSubmit = async (data) => {
    if (!userInfo) {
      toast.error("اطلاعات  کاربر یافت نشد!", {
        style: errorStyle,
      });
      return;
    }
    // If user selected "هیچ کدام" (which is saved as "null" string), convert it to actual null
    const cleanedAudioUrl = data.audioUrl === "null" ? null : data.audioUrl;

    // Prepare the common payload to send for both create and edit
    const basePayload = {
      ...data,
      audioUrl: cleanedAudioUrl,
      alarmCategoryId: data.alarmCategoryId, 
    };

    // If editing an existing event, submit with the event ID
    if (isEdit && settings?.id) {
      await onSubmit(basePayload, settings.id);
    } else {
      // If creating a new event, include the user ID in the payload
      await onSubmit({
        ...basePayload,
        userId: userInfo.id,
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="bg-white py-6 px-4 rounded-lg w-[500px] shadow-lg"
        overlayClassName="modal-overlay-class backdrop-blur-[2px]"
      >
        <FormModal
          isOpen={true}
          onRequestClose={onClose}
          title={"تنظیمات رویداد"}
          schema={schema}
          initialData={isEdit ? settings : null}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
};

export default EventSettingModal;
