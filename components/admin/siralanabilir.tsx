"use client";

import { useEffect, useId, useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import styles from "./siralanabilir.module.css";

/**
 * Sürükle-bırak sıralama.
 *
 * Klavyeyle de çalışır: sekme ile öğeye gelip boşluk tuşuna basınca
 * yön tuşlarıyla taşınır. Fareyle sürüklemek tek yol değil.
 *
 * Sıra değiştiğinde `kaydet` çağrılır; kaydedilene kadar liste
 * yeni sırasında görünür, hata olursa eski sıraya döner.
 */

export type SiraOgesi = {
  id: string;
  /** kartın içeriği */
  icerik: React.ReactNode;
};

export default function Siralanabilir({
  ogeler,
  kaydet,
  duzen = "izgara",
  bosMesaj = "Liste boş.",
}: {
  ogeler: SiraOgesi[];
  kaydet: (siraliIdler: string[]) => Promise<{ ok: boolean; mesaj: string }>;
  duzen?: "izgara" | "liste";
  bosMesaj?: string;
}) {
  const [liste, setListe] = useState(ogeler);
  const [bekliyor, basla] = useTransition();

  /* Dışarıdan gelen liste değişince (ör. vitrine ürün eklenince) içerideki
     sıra da güncellensin. Yalnızca öğeler farklıysa: sürükleme sonrası
     gereksiz yeniden çizim olmasın. */
  useEffect(() => {
    const gelen = ogeler.map((o) => o.id).join("|");
    const mevcut = liste.map((o) => o.id).join("|");
    if (gelen !== mevcut) setListe(ogeler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ogeler]);

  const [durum, setDurum] = useState<{ ok: boolean; mesaj: string } | null>(null);
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function birakildi(olay: DragEndEvent) {
    const { active, over } = olay;
    if (!over || active.id === over.id) return;

    const eski = liste;
    const eskiIndex = liste.findIndex((o) => o.id === active.id);
    const yeniIndex = liste.findIndex((o) => o.id === over.id);
    const yeni = arrayMove(liste, eskiIndex, yeniIndex);

    setListe(yeni);
    setDurum(null);

    basla(async () => {
      const s = await kaydet(yeni.map((o) => o.id));
      setDurum(s);
      if (!s.ok) setListe(eski); // başarısızsa geri al
    });
  }

  if (liste.length === 0) {
    return <p className={styles.bos}>{bosMesaj}</p>;
  }

  return (
    <>
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={birakildi}
      >
        <SortableContext items={liste.map((o) => o.id)} strategy={rectSortingStrategy}>
          <div className={duzen === "liste" ? styles.liste : styles.izgara}>
            {liste.map((o, i) => (
              <Oge key={o.id} id={o.id} sira={i + 1} duzen={duzen}>
                {o.icerik}
              </Oge>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <p className={styles.durum}>
        {bekliyor ? (
          <span className={styles.kaydediliyor}>Sıra kaydediliyor…</span>
        ) : durum ? (
          <span className={durum.ok ? styles.ok : styles.hata}>{durum.mesaj}</span>
        ) : (
          <span className={styles.ipucu}>
            Kartları sürükleyerek sırala. Klavyeyle: sekme ile seç, boşluk tuşuna
            bas, yön tuşlarıyla taşı.
          </span>
        )}
      </p>
    </>
  );
}

function Oge({
  id,
  sira,
  duzen,
  children,
}: {
  id: string;
  sira: number;
  duzen: "izgara" | "liste";
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`${duzen === "liste" ? styles.satir : styles.kart} ${
        isDragging ? styles.suruklenen : ""
      }`}
    >
      <button
        type="button"
        className={styles.tutamak}
        {...attributes}
        {...listeners}
        aria-label={`${sira}. sırayı taşı`}
      >
        <GripVertical size={15} strokeWidth={1.8} />
      </button>
      <span className={styles.sira}>{sira}</span>
      <div className={styles.icerik}>{children}</div>
    </div>
  );
}
