import React, { useState } from 'react';

export default function MSPPricingCalculator() {
  // State for inputs
  const [devices, setDevices] = useState({
    workstations: 1000,
    physicalServers: 100,
    virtualServers: 50,
    networkDevices: 50
  });
  
  const [serviceLevel, setServiceLevel] = useState('fullyManaged');
  const [contractTerm, setContractTerm] = useState('1year');
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [bundles, setBundles] = useState({
    enterpriseSecurity: false,
    enterpriseBackup: false,
    enterpriseComplete: false
  });
  
  // Calculate total devices
  const totalDevices = 
    parseInt(devices.workstations) + 
    parseInt(devices.physicalServers) + 
    parseInt(devices.virtualServers) + 
    parseInt(devices.networkDevices);
  
  // Determine tier
  let tier, efficiencyFactor, profitMargin;
  if (totalDevices <= 200) {
    tier = "Tier 1";
    efficiencyFactor = 1.0;
    profitMargin = 0.65;
  } else if (totalDevices <= 1000) {
    tier = "Tier 2";
    efficiencyFactor = 0.85;
    profitMargin = 0.55;
  } else if (totalDevices <= 5000) {
    tier = "Tier 3";
    efficiencyFactor = 0.7;
    profitMargin = 0.5;
  } else if (totalDevices <= 10000) {
    tier = "Tier 4";
    efficiencyFactor = 0.6;
    profitMargin = 0.45;
  } else if (totalDevices <= 20000) {
    tier = "Tier 5";
    efficiencyFactor = 0.5;
    profitMargin = 0.4;
  } else if (totalDevices <= 50000) {
    tier = "Tier 6";
    efficiencyFactor = 0.4;
    profitMargin = 0.35;
  } else {
    tier = "Tier 7";
    efficiencyFactor = 0.3;
    profitMargin = 0.3;
  }
  
  // Service level multiplier
  let serviceLevelMultiplier;
  switch(serviceLevel) {
    case 'monitorOnly':
      serviceLevelMultiplier = 0.8;
      break;
    case 'monitorBasic':
      serviceLevelMultiplier = 0.9;
      break;
    case 'monitorRemediation':
      serviceLevelMultiplier = 1.0;
      break;
    case 'advancedManagement':
      serviceLevelMultiplier = 1.15;
      break;
    case 'fullyManaged':
      serviceLevelMultiplier = 1.3;
      break;
    default:
      serviceLevelMultiplier = 1.0;
  }
  
  // Contract term discount
  let contractDiscount;
  switch(contractTerm) {
    case '1year':
      contractDiscount = 0;
      break;
    case '2year':
      contractDiscount = 0.05;
      break;
    case '3year':
      contractDiscount = 0.1;
      break;
    default:
      contractDiscount = 0;
  }
  
  // Payment frequency discount
  let paymentDiscount = 0;
  if (paymentFrequency === 'annual') {
    if (totalDevices <= 5000) {
      paymentDiscount = 0.05;
    } else if (totalDevices <= 20000) {
      paymentDiscount = 0.08;
    } else {
      paymentDiscount = 0.12;
    }
  }
  
  // Bundle discount
  let bundleDiscount = 0;
  let appliedBundle = "";
  
  if (bundles.enterpriseComplete) {
    bundleDiscount = 0.15;
    appliedBundle = "Enterprise Complete Bundle";
  } else if (bundles.enterpriseSecurity) {
    bundleDiscount = 0.13;
    appliedBundle = "Enterprise Security Bundle";
  } else if (bundles.enterpriseBackup) {
    bundleDiscount = 0.12;
    appliedBundle = "Enterprise Backup Bundle";
  }
  
  // Calculate labor hours
  let workstationHourRate, serverHourRate, networkHourRate;
  
  // Adjust hour rates based on tier
  if (tier === "Tier 5" || tier === "Tier 6") {
    workstationHourRate = 0.035;
    serverHourRate = 1.1;
    networkHourRate = 0.08;
  } else if (tier === "Tier 7") {
    workstationHourRate = 0.03;
    serverHourRate = 0.95;
    networkHourRate = 0.07;
  } else {
    workstationHourRate = 0.04;
    serverHourRate = 1.25;
    networkHourRate = 0.1;
  }
  
  const workstationHours = devices.workstations * workstationHourRate;
  const serverHours = (parseInt(devices.physicalServers) + parseInt(devices.virtualServers)) * serverHourRate;
  const networkHours = devices.networkDevices * networkHourRate;
  
  const totalBaseHours = workstationHours + serverHours + networkHours;
  const adjustedHours = totalBaseHours * efficiencyFactor;
  const totalServiceHours = adjustedHours * serviceLevelMultiplier;
  
  // Calculate labor costs with appropriate staff mix
  let offshorePercentage, usBasedPercentage, architectPercentage;
  
  if (tier === "Tier 4" || tier === "Tier 5") {
    offshorePercentage = 0.75;
    usBasedPercentage = 0.2;
    architectPercentage = 0.05;
  } else if (tier === "Tier 6" || tier === "Tier 7") {
    offshorePercentage = 0.8;
    usBasedPercentage = 0.15;
    architectPercentage = 0.05;
  } else {
    offshorePercentage = 0.7;
    usBasedPercentage = 0.2;
    architectPercentage = 0.1;
  }
  
  const offshoreHours = totalServiceHours * offshorePercentage;
  const usBasedHours = totalServiceHours * usBasedPercentage;
  const architectHours = totalServiceHours * architectPercentage;
  
  const laborCost = (offshoreHours * 45) + (usBasedHours * 75) + (architectHours * 137);
  
  // Calculate tooling costs with volume discounts
  let rmmRate, socRate;
  
  if (tier === "Tier 1" || tier === "Tier 2") {
    rmmRate = 0.5;
    socRate = 9;
  } else if (tier === "Tier 3") {
    rmmRate = 0.425;
    socRate = 7.65;
  } else if (tier === "Tier 4") {
    rmmRate = 0.375;
    socRate = 6.75;
  } else if (tier === "Tier 5") {
    rmmRate = 0.325;
    socRate = 5.85;
  } else {
    rmmRate = 0.275;
    socRate = 4.95;
  }
  
  const rmmCost = totalDevices * rmmRate;
  const socCost = totalDevices * socRate;
  
  const baseToolingCost = rmmCost + socCost;
  const discountedToolingCost = baseToolingCost * (1 - bundleDiscount);
  
  // Total costs
  const baseCost = laborCost + discountedToolingCost;
  const withProfitMargin = baseCost / (1 - profitMargin);
  const withContractDiscount = withProfitMargin * (1 - contractDiscount);
  const finalMonthlyCost = withContractDiscount * (1 - paymentDiscount);
  const annualCost = finalMonthlyCost * 12;
  const perDeviceCost = finalMonthlyCost / totalDevices;
  
  // Calculate legacy model for comparison
  let legacyEfficiency, legacyProfit;
  
  if (totalDevices <= 200) {
    legacyEfficiency = 1.0;
    legacyProfit = 0.65;
  } else if (totalDevices <= 1000) {
    legacyEfficiency = 0.85;
    legacyProfit = 0.55;
  } else if (totalDevices <= 5000) {
    legacyEfficiency = 0.7;
    legacyProfit = 0.5;
  } else if (totalDevices <= 10000) {
    legacyEfficiency = 0.6;
    legacyProfit = 0.45;
  } else {
    legacyEfficiency = 0.5;
    legacyProfit = 0.4;
  }
  
  const legacyWorkstationHours = devices.workstations * 0.04;
  const legacyServerHours = (parseInt(devices.physicalServers) + parseInt(devices.virtualServers)) * 1.25;
  const legacyNetworkHours = devices.networkDevices * 0.1;
  
  const legacyBaseHours = legacyWorkstationHours + legacyServerHours + legacyNetworkHours;
  const legacyAdjustedHours = legacyBaseHours * legacyEfficiency;
  const legacyServiceHours = legacyAdjustedHours * 1.3; // Assume fully managed
  
  const legacyOffshoreHours = legacyServiceHours * 0.7;
  const legacyUsHours = legacyServiceHours * 0.2;
  const legacyArchitectHours = legacyServiceHours * 0.1;
  
  const legacyLaborCost = (legacyOffshoreHours * 45) + (legacyUsHours * 75) + (legacyArchitectHours * 137);
  
  const legacyToolingCost = (totalDevices * 0.5) + (totalDevices * 9); // RMM + SOC
  
  const legacyTotalCost = legacyLaborCost + legacyToolingCost;
  const legacyWithProfit = legacyTotalCost / (1 - legacyProfit);
  const legacyPerDevice = legacyWithProfit / totalDevices;
  
  // Calculate savings
  const savings = legacyWithProfit - finalMonthlyCost;
  const savingsPercentage = (savings / legacyWithProfit) * 100;
  
  // Handle input changes
  const handleDeviceChange = (e) => {
    const { name, value } = e.target;
    setDevices({
      ...devices,
      [name]: value
    });
  };
  
  const handleBundleChange = (e) => {
    const { name, checked } = e.target;
    setBundles({
      ...bundles,
      [name]: checked
    });
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">MSP Pricing Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="md:col-span-1">
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">Environment Details</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="workstations" className="block text-sm font-medium mb-1">
                    Number of Workstations
                  </label>
                  <input
                    type="number"
                    id="workstations"
                    name="workstations"
                    value={devices.workstations}
                    onChange={handleDeviceChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="physicalServers" className="block text-sm font-medium mb-1">
                    Number of Physical Servers
                  </label>
                  <input
                    type="number"
                    id="physicalServers"
                    name="physicalServers"
                    value={devices.physicalServers}
                    onChange={handleDeviceChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="virtualServers" className="block text-sm font-medium mb-1">
                    Number of Virtual Servers
                  </label>
                  <input
                    type="number"
                    id="virtualServers"
                    name="virtualServers"
                    value={devices.virtualServers}
                    onChange={handleDeviceChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="networkDevices" className="block text-sm font-medium mb-1">
                    Number of Network Devices
                  </label>
                  <input
                    type="number"
                    id="networkDevices"
                    name="networkDevices"
                    value={devices.networkDevices}
                    onChange={handleDeviceChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg shadow-sm overflow-hidden mt-4">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">Service Options</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="serviceLevel" className="block text-sm font-medium mb-1">
                    Service Level
                  </label>
                  <select
                    id="serviceLevel"
                    value={serviceLevel}
                    onChange={(e) => setServiceLevel(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="monitorOnly">Monitor Only (80%)</option>
                    <option value="monitorBasic">Monitor + Basic Remediation (90%)</option>
                    <option value="monitorRemediation">Monitor + Remediation (100%)</option>
                    <option value="advancedManagement">Advanced Management (115%)</option>
                    <option value="fullyManaged">Fully Managed Support (130%)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="contractTerm" className="block text-sm font-medium mb-1">
                    Contract Term
                  </label>
                  <select
                    id="contractTerm"
                    value={contractTerm}
                    onChange={(e) => setContractTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="1year">1 Year</option>
                    <option value="2year">2 Years (5% discount)</option>
                    <option value="3year">3 Years (10% discount)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="paymentFrequency" className="block text-sm font-medium mb-1">
                    Payment Frequency
                  </label>
                  <select
                    id="paymentFrequency"
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual (5-12% discount)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Bundle Options</label>
                  <div className="flex items-start mb-2">
                    <input
                      type="checkbox"
                      id="enterpriseSecurity"
                      name="enterpriseSecurity"
                      checked={bundles.enterpriseSecurity}
                      onChange={handleBundleChange}
                      className="mt-1 mr-2"
                    />
                    <label htmlFor="enterpriseSecurity" className="text-sm">
                      <span className="font-medium">Enterprise Security Bundle</span>
                      <span className="ml-1 text-xs text-gray-500">(13% discount)</span>
                      <p className="text-xs text-gray-500">RMM + Managed SOC + EDR</p>
                    </label>
                  </div>
                  
                  <div className="flex items-start mb-2">
                    <input
                      type="checkbox"
                      id="enterpriseBackup"
                      name="enterpriseBackup"
                      checked={bundles.enterpriseBackup}
                      onChange={handleBundleChange}
                      className="mt-1 mr-2"
                    />
                    <label htmlFor="enterpriseBackup" className="text-sm">
                      <span className="font-medium">Enterprise Backup Bundle</span>
                      <span className="ml-1 text-xs text-gray-500">(12% discount)</span>
                      <p className="text-xs text-gray-500">RMM + Cove Data Protect</p>
                    </label>
                  </div>
                  
                  <div className="flex items-start mb-2">
                    <input
                      type="checkbox"
                      id="enterpriseComplete"
                      name="enterpriseComplete"
                      checked={bundles.enterpriseComplete}
                      onChange={handleBundleChange}
                      className="mt-1 mr-2"
                    />
                    <label htmlFor="enterpriseComplete" className="text-sm">
                      <span className="font-medium">Enterprise Complete Bundle</span>
                      <span className="ml-1 text-xs text-gray-500">(15% discount)</span>
                      <p className="text-xs text-gray-500">RMM + SOC + EDR + Backup + DNS</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="md:col-span-2">
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">Pricing Summary</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Environment Information</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Total Devices:</span>
                      <span className="font-medium">{totalDevices.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tier:</span>
                      <span className="font-medium">{tier}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Efficiency Factor:</span>
                      <span className="font-medium">{(efficiencyFactor * 100).toFixed(0)}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Profit Margin:</span>
                      <span className="font-medium">{(profitMargin * 100).toFixed(0)}%</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Pricing Information</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Monthly Price:</span>
                      <span className="font-medium">{formatCurrency(finalMonthlyCost)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Annual Price:</span>
                      <span className="font-medium">{formatCurrency(annualCost)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Price Per Device:</span>
                      <span className="font-medium">{formatCurrency(perDeviceCost)}</span>
                    </li>
                    <li className="flex justify-between font-semibold text-green-600">
                      <span>Savings vs Current Model:</span>
                      <span>{formatCurrency(savings)}/month ({savingsPercentage.toFixed(1)}%)</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Cost Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium mb-1">Labor Cost</h4>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Total Service Hours:</span>
                        <span>{totalServiceHours.toFixed(1)} hours/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labor Cost:</span>
                        <span>{formatCurrency(laborCost)}/month</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium mb-1">Tooling Cost</h4>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Base Tooling Cost:</span>
                        <span>{formatCurrency(baseToolingCost)}/month</span>
                      </div>
                      {bundleDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Bundle Applied:</span>
                          <span>{appliedBundle} ({(bundleDiscount * 100).toFixed(0)}% discount)</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium">
                        <span>Final Tooling Cost:</span>
                        <span>{formatCurrency(discountedToolingCost)}/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-lg mb-2 text-blue-800">Comparison with Current Pricing Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-1">Current Model</h4>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Monthly Price:</span>
                        <span>{formatCurrency(legacyWithProfit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Per Device:</span>
                        <span>{formatCurrency(legacyPerDevice)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-700 mb-1">Enhanced Model</h4>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Monthly Price:</span>
                        <span>{formatCurrency(finalMonthlyCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Per Device:</span>
                        <span>{formatCurrency(perDeviceCost)}</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-1 text-green-600">
                        <span>Monthly Savings:</span>
                        <span>{formatCurrency(savings)} ({savingsPercentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
