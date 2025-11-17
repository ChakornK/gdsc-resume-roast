import Image from "next/image";

export default function Loading() {
  return (
    <>
      <Image src={"/loading.gif"} alt="GDSC" width={300} height={300} />
    </>
  );
}
