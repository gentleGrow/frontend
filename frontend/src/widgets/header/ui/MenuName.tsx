export default function MenuName({
  name,
  isHovered = false,
}: {
  name: string;
  isHovered?: boolean;
}) {
  return (
    <h4
      className={`${isHovered && "text-gray-60"} text-heading-4 text-gray-100 hover:text-gray-60`}
    >
      {name}
    </h4>
  );
}
