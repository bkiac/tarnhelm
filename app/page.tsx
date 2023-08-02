import {lnd} from "@/lib/lnd";
import { getBlock } from "lightning";
import { notFound } from "next/navigation";

export default async function Ln({
  params: { height },
}: {
  params: { height: number };
}) {
  const { block } = await getBlock({ lnd, height: height });

  if (!block) {
    notFound();
  }

  return block;
}
