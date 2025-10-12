import { useState, useCallback } from 'react';
import { CONTRACTS } from '@/constants/contracts/contracts';

export interface YRTFormData {
  name: string;
  symbol: string;
  propertyName: string;
  initialSupply: string;
  tokenPrice: string;
  underlyingToken: string;
  fundraisingDuration: number;
}

export interface YRTSampleData {
  name: string;
  symbol: string;
  propertyName: string;
  initialSupply: string;
  tokenPrice: string;
  fundraisingDuration: number;
}

const initialFormData: YRTFormData = {
  name: '',
  symbol: '',
  propertyName: '',
  initialSupply: '',
  tokenPrice: '',
  underlyingToken: CONTRACTS.USDC, // Default to USDC
  fundraisingDuration: 180, // Default 3 minutes for demo
};

// Sample data based on unit tests
const sampleData: YRTSampleData = {
  name: 'YRT Sudirman Residence',
  symbol: 'YRT-SDR',
  propertyName: 'Sudirman Residence Jakarta',
  initialSupply: '1000',
  tokenPrice: '1.0',
  fundraisingDuration: 180,
};

export function useYRTForm() {
  const [formData, setFormData] = useState<YRTFormData>(initialFormData);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fundraisingDuration' ? Number(value) : value
    }));
  }, []);

  const fillSampleData = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      ...sampleData
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const isFormValid = useCallback(() => {
    return formData.name.trim() !== '' &&
           formData.symbol.trim() !== '' &&
           formData.propertyName.trim() !== '' &&
           formData.tokenPrice.trim() !== '' &&
           parseFloat(formData.tokenPrice) > 0;
  }, [formData]);

  return {
    formData,
    handleInputChange,
    fillSampleData,
    resetForm,
    isFormValid,
    sampleData,
  };
}