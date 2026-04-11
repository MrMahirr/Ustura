import React from 'react';
import { PackageService, type Package, type Subscription } from '@/services/package.service';

export interface PackageProfileData extends Package {
  subscribers: Subscription[];
}

export function usePackageProfile(packageId?: string) {
  const [profile, setProfile] = React.useState<PackageProfileData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Editable form state
  const [name, setName] = React.useState('');
  const [tierLabel, setTierLabel] = React.useState('');
  const [pricePerMonth, setPricePerMonth] = React.useState('');
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [features, setFeatures] = React.useState<any[]>([]);

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

  const handleSave = async () => {
    if (!packageId) return false;
    
    try {
      const updatedData = {
        name,
        tierLabel,
        pricePerMonth: parseFloat(pricePerMonth) || 0,
        isFeatured,
        features,
      };
      
      await PackageService.updatePackage(packageId, updatedData);
      await fetchProfile(); // Refresh
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const handleDeactivate = async () => {
    if (!packageId) return false;
    try {
      await PackageService.updatePackage(packageId, { isActive: false });
      await fetchProfile();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    profile,
    isLoading,
    error,
    formState: {
      name, setName,
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
