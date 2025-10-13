import Image from "next/image";

const avatars = Array.from(
  { length: 100 },
  (_, i) => `/avatars/Number=${i + 1}.png`
);

export default function AvatarPicker({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (url: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-auto p-4">
      {avatars.map((url) => (
        <button
          key={url}
          onClick={() => onSelect(url)}
          className={`rounded-full border-2 p-2 hover:bg-muted cursor-pointer ${
            selected === url ? "border-primary-400" : "border-transparent"
          }`}
        >
          <Image
            src={url}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full"
          />
        </button>
      ))}
    </div>
  );
}
