import React from 'react';
import {
  PackageService,
  type Package,
  type PackageFeature,
  type PackageTier,
  type Subscription,
} from '@/services/package.service';

export interface PackageProfileData extends Package {
  subscribers: Subscription[];
}

export function usePackageProfile(packageId?: string) {
  const [profile, setProfile] = React.useState<PackageProfileData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Editable form state
  const [name, setName] = React.useState('');
  const [tier, setTier] = React.useState<PackageTier>('baslangic');
  const [tierLabel, setTierLabel] = React.useState('');
  const [pricePerMonth, setPricePerMonth] = React.useState('');
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [features, setFeatures] = React.useState<PackageFeature[]>([]);

  const fetchProfile = React.useCallback(async () => {
    if (!packageId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await PackageService.getPackageById(packageId);
      setProfile(data);
      
      // Initialize form state
      setName(data.name);
      setTier(data.tier);
      setTierLabel(data.tierLabel);
      setPricePerMonth(data.pricePerMonth.toString());
      setIsFeatured(data.isFeatured);
      setFeatures(data.features || []);
    } catch (err: any) {
      console.error('Failed to fetch package profile:', err);
      setError(err.message || 'Paket detaylari yuklenirken bir hata olustu.');
    } finally {
      setIsLoading(false);
    }
  }, [packageId]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleToggleFeature = (index: number) => {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, included: !f.included } : f)),
    );
  };

  const handleFeatureLabelChange = (text: string, index: number) => {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, label: text } : f)),
    );
  };

  const addFeature = () => {
    setFeatures((prev) => [...prev, { label: 'Yeni Özellik', included: false }]);
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (): Promise<
    { ok: true } | { ok: false; message: string }
  > => {
    if (!packageId) {
      const message = 'Paket secilmedi.';
      setError(message);
      return { ok: false, message };
    }

    setError(null);

    const trimmedName = name.trim();
    const trimmedTierLabel = tierLabel.trim();
    if (!trimmedName || !trimmedTierLabel) {
      const message = 'Paket adi ve tier etiketi zorunludur.';
      setError(message);
      return { ok: false, message };
    }

    const normalizedPrice = String(pricePerMonth).trim().replace(',', '.');
    const parsedPrice = parseFloat(normalizedPrice);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      const message = 'Gecerli bir aylik fiyat girin.';
      setError(message);
      return { ok: false, message };
    }

    const sanitizedFeatures = features.map((f, index) => ({
      label: (f.label ?? '').trim() || `Ozellik ${index + 1}`,
      included: Boolean(f.included),
    }));

    try {
      await PackageService.updatePackage(packageId, {
        name: trimmedName,
        tier,
        tierLabel: trimmedTierLabel,
        pricePerMonth: parsedPrice,
        isFeatured,
        features: sanitizedFeatures,
      });
      await fetchProfile();
      return { ok: true };
    } catch (err: any) {
      const message =
        typeof err?.message === 'string' && err.message.trim()
          ? err.message
          : 'Kayit sirasinda bir hata olustu.';
      setError(message);
      return { ok: false, message };
    }
  };

  const handleDeactivate = async (): Promise<
    { ok: true } | { ok: false; message: string }
  > => {
    if (!packageId) {
      const message = 'Paket secilmedi.';
      setError(message);
      return { ok: false, message };
    }

    setError(null);

    try {
      await PackageService.updatePackage(packageId, { isActive: false });
      await fetchProfile();
      return { ok: true };
    } catch (err: any) {
      const message =
        typeof err?.message === 'string' && err.message.trim()
          ? err.message
          : 'Islem basarisiz.';
      setError(message);
      return { ok: false, message };
    }
  };

  return {
    profile,
    isLoading,
    error,
    formState: {
      name, setName,
      tier, setTier,
      tierLabel, setTierLabel,
      pricePerMonth, setPricePerMonth,
      isFeatured, setIsFeatured,
      features,
      handleToggleFeature,
      handleFeatureLabelChange,
      addFeature,
      removeFeature,
    },
    handleSave,
    handleDeactivate,
    refresh: fetchProfile,
  };
}
