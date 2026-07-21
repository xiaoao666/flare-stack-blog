import { useFormContext } from "react-hook-form";
import { AssetUploadField } from "@/features/config/components/asset-upload-field";
import type { SystemConfig } from "@/features/config/config.schema";

export function OaciaThemeSettings() {
  const { formState: { errors } } = useFormContext<SystemConfig>();

  return (
    <div className="grid gap-6 md:col-span-2 md:grid-cols-3">
      {[0, 1, 2].map((index) => (
        <AssetUploadField
          key={index}
          name={`site.theme.oacia.carouselImages.${index}`}
          assetPath={`theme/oacia/carousel-${index + 1}.jpg`}
          accept=".png,.jpg,.jpeg,.webp"
          label={`轮播图片 ${index + 1}`}
          hint="推荐横向图片，比例约 16:9"
          error={errors.site?.theme?.oacia?.carouselImages?.[index]?.message}
        />
      ))}
    </div>
  );
}
