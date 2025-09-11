import type { FormSchema } from "../components/Form/formSchema";

const sounds = [
  { id: 1, label: "هیچ کدام", src: "null" },
  { id: 2, label: "صدا 1", src: "/sounds/sound-one.mp3" },
];

export function createEventSettingSchema(alarms: { id: string | number; label: string }[] , isEditForm : boolean) {
  return [
    {
      name: "alarmCategoryId",
      label: "انتخاب آلارم",
      type: "select",
      required: true,
      wrapperClassName: "col-span-1",
      options: alarms.map(a => ({ label: a.label, value: a.id })),
      getInitial: (b: any) => b.alarmCategoryId,
    },
    {
      name: "audioUrl",
      label: "انتخاب صدا",
      type: "select",
      required:isEditForm ? false : true,
      wrapperClassName: "col-span-1",
      options: sounds.map(s => ({
        label: s.label,
        value: s.src,
      })),
      getInitial: (b: any) => b.audioUrl,
    },
    {
      name: "alarmColor",
      label: "انتخاب رنگ",
      type: "color",
      required: isEditForm ? false : true,
      wrapperClassName: "col-span-2",
      getInitial: (b: any) => b.alarmColor,
    },
  ] as FormSchema<any>;
}
