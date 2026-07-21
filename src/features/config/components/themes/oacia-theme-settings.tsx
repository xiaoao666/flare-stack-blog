import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { AssetUploadField } from "@/features/config/components/asset-upload-field";
import type { SystemConfig } from "@/features/config/config.schema";

const MAX_CAROUSEL_IMAGES = 5;

export function OaciaThemeSettings() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SystemConfig>();
  const images = watch("site.theme.oacia.carouselImages") ?? [];
  const updateImages = (next: Array<string>) =>
    setValue("site.theme.oacia.carouselImages", next, { shouldDirty: true });
  const move = (from: number, to: number) => {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateImages(next);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">轮播图片</p>
          <p className="mt-1 text-xs text-muted-foreground">
            支持 1–{MAX_CAROUSEL_IMAGES} 张，按列表顺序自动渐变播放。
          </p>
        </div>
        <button
          type="button"
          onClick={() => updateImages([...images, ""])}
          disabled={images.length >= MAX_CAROUSEL_IMAGES}
          className="inline-flex h-9 items-center gap-2 border border-border/50 px-3 text-xs font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={14} /> 添加图片
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="border border-border/30 bg-background/40 p-4">
            <AssetUploadField
              name={`site.theme.oacia.carouselImages.${index}`}
              assetPath={`theme/oacia/carousel-${index + 1}.jpg`}
              accept=".png,.jpg,.jpeg,.webp"
              label={`轮播图片 ${index + 1}`}
              hint="推荐横向图片，比例约 16:9"
              error={errors.site?.theme?.oacia?.carouselImages?.[index]?.message}
            />
            <div className="mt-4 flex justify-end gap-2 border-t border-border/20 pt-3">
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                className="grid size-8 place-items-center border border-border/40 disabled:opacity-30"
                aria-label="向前移动"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === images.length - 1}
                className="grid size-8 place-items-center border border-border/40 disabled:opacity-30"
                aria-label="向后移动"
              >
                <ArrowDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => updateImages(images.filter((_, itemIndex) => itemIndex !== index))}
                disabled={images.length <= 1}
                className="grid size-8 place-items-center border border-destructive/30 text-destructive disabled:opacity-30"
                aria-label="删除图片"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
