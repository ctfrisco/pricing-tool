import React, { useState, useEffect } from 'react';
import UserInfo from './components/UserInfo';
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/.auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.clientPrincipal) {
          setUser(data.clientPrincipal);
        }
      });
  }, []);

  const login = () => {
    window.location.href = '/.auth/login/aad';
  };

  const logout = () => {
    window.location.href = '/.auth/logout';
  };

  // Input state
  const [devices, setDevices] = useState({
    workstations: 1000,
    physicalServers: 100,
    virtualServers: 50,
    networkDevices: 50
  });
  
  const [serviceLevel, setServiceLevel] = useState('fullyManaged');
  const [contractTerm, setContractTerm] = useState('1year');
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [selectedBundle, setSelectedBundle] = useState('none');
  // NEW: Usage Factor state for the consumption-based component
  const [usageFactor, setUsageFactor] = useState(1.0);

  // Industry comparison state
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonInputs, setComparisonInputs] = useState({
    itStaffCount: 5,
    averageSalary: 85000,
    benefits: 30,
    overhead: 20,
    competitorPrice: 85
  });
  
  // Calculate total devices
  const totalDevices = 
    parseInt(devices.workstations || 0) + 
    parseInt(devices.physicalServers || 0) + 
    parseInt(devices.virtualServers || 0) + 
    parseInt(devices.networkDevices || 0);
  
  // Determine tier - simplified enterprise tiers for large device counts
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
    efficiencyFactor = 0.70;
    profitMargin = 0.45;
  } else {
    tier = "Enterprise"; // For large device counts, a single enterprise tier
    efficiencyFactor = 0.50;
    profitMargin = 0.35;
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
      contractDiscount = 0.05;
      break;
    case '2year':
      contractDiscount = 0.10;
      break;
    case '3year':
      contractDiscount = 0.15;
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
  switch(selectedBundle) {
    case 'enterpriseComplete':
      bundleDiscount = 0.15;
      appliedBundle = "Enterprise Complete Bundle";
      break;
    case 'enterpriseSecurity':
      bundleDiscount = 0.10;
      appliedBundle = "Enterprise Security Bundle";
      break;
    case 'enterpriseBackup':
      bundleDiscount = 0.05;
      appliedBundle = "Enterprise Backup Bundle";
      break;
    default:
      bundleDiscount = 0;
      appliedBundle = "";
  }
  
  // Calculate labor hours with adjusted hour rates based on the new tier structure
  let workstationHourRate, serverHourRate, networkHourRate;
  if (tier === "Tier 1") {
    workstationHourRate = 0.04;
    serverHourRate = 1.25;
    networkHourRate = 0.1;
  } else if (tier === "Tier 2") {
    workstationHourRate = 0.035;
    serverHourRate = 1.1;
    networkHourRate = 0.09;
  } else if (tier === "Tier 3") {
    workstationHourRate = 0.03;
    serverHourRate = 0.95;
    networkHourRate = 0.08;
  } else if (tier === "Enterprise") {
    workstationHourRate = 0.025;
    serverHourRate = 0.80;
    networkHourRate = 0.06;
  }
  
  const workstationHours = devices.workstations * workstationHourRate;
  const serverHours = (parseInt(devices.physicalServers || 0) + parseInt(devices.virtualServers || 0)) * serverHourRate;
  const networkHours = devices.networkDevices * networkHourRate;
  
  const totalBaseHours = workstationHours + serverHours + networkHours;
  const adjustedHours = totalBaseHours * efficiencyFactor;
  const totalServiceHours = adjustedHours * serviceLevelMultiplier;
  
  // Calculate labor costs with appropriate staff mix
  let offshorePercentage, usBasedPercentage, architectPercentage;
  if (tier === "Enterprise") {
    offshorePercentage = 0.85;
    usBasedPercentage = 0.10;
    architectPercentage = 0.05;
  } else {
    // For smaller tiers
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
    rmmRate = 0.50;
    socRate = 7.5;
  } else { // Enterprise
    rmmRate = 0.50;
    socRate = 6;
  }
  
  // Check if security bundle is selected to include SOC costs
  const isSecurityBundle = selectedBundle === 'enterpriseSecurity' || selectedBundle === 'enterpriseComplete';
  
  const rmmCost = totalDevices * rmmRate;
  const socCost = isSecurityBundle ? totalDevices * socRate : 0;
  
  const baseToolingCost = rmmCost + socCost;
  const discountedToolingCost = baseToolingCost * (1 - bundleDiscount);
  
  // NEW: Hybrid Pricing Model: Combine a fixed fee (tooling cost) with a consumption-based component (labor cost scaled by usageFactor)
  const hybridBaseCost = discountedToolingCost + (laborCost * usageFactor);
  const withProfitMargin = hybridBaseCost / (1 - profitMargin);
  const withContractDiscount = withProfitMargin * (1 - contractDiscount);
  const finalMonthlyCost = withContractDiscount * (1 - paymentDiscount);
  const annualCost = finalMonthlyCost * 12;
  const perDeviceCost = finalMonthlyCost / totalDevices;

  // Handle comparison input changes
  const handleComparisonChange = (e) => {
    const { name, value } = e.target;
    setComparisonInputs({
      ...comparisonInputs,
      [name]: parseFloat(value)
    });
  };

  // Calculate in-house IT costs
  const calculateInHouseCosts = () => {
    const { itStaffCount, averageSalary, benefits, overhead } = comparisonInputs;
    
    const annualSalaryCost = itStaffCount * averageSalary;
    const benefitsCost = annualSalaryCost * (benefits / 100);
    const overheadCost = annualSalaryCost * (overhead / 100);
    const totalAnnualCost = annualSalaryCost + benefitsCost + overheadCost;
    const monthlyCost = totalAnnualCost / 12;
    const costPerDevice = totalDevices ? totalAnnualCost / 12 / totalDevices : 0;
    
    return {
      annualCost: totalAnnualCost,
      monthlyCost,
      costPerDevice
    };
  };

  // Calculate competitor MSP costs
  const calculateCompetitorCosts = () => {
    const { competitorPrice } = comparisonInputs;
    
    const monthlyCost = competitorPrice * totalDevices;
    const annualCost = monthlyCost * 12;
    
    return {
      annualCost,
      monthlyCost,
      costPerDevice: competitorPrice
    };
  };

  // Calculate savings
  const calculateComparativeSavings = () => {
    const inHouseCosts = calculateInHouseCosts();
    const competitorCosts = calculateCompetitorCosts();
    
    const inHouseSavings = {
      monthly: inHouseCosts.monthlyCost - finalMonthlyCost,
      annual: inHouseCosts.annualCost - annualCost,
      percentage: inHouseCosts.monthlyCost ? ((inHouseCosts.monthlyCost - finalMonthlyCost) / inHouseCosts.monthlyCost) * 100 : 0
    };
    
    const competitorSavings = {
      monthly: competitorCosts.monthlyCost - finalMonthlyCost,
      annual: competitorCosts.annualCost - annualCost,
      percentage: competitorCosts.monthlyCost ? ((competitorCosts.monthlyCost - finalMonthlyCost) / competitorCosts.monthlyCost) * 100 : 0
    };
    
    return {
      inHouse: inHouseSavings,
      competitor: competitorSavings
    };
  };

  // Access the comparison data
  const comparisonData = {
    inHouse: calculateInHouseCosts(),
    competitor: calculateCompetitorCosts(),
    savings: calculateComparativeSavings()
  };
  
  // Auto-adjust staff count based on environment size
  useEffect(() => {
    let staffCount = 2; // default
    
    if (totalDevices > 500 && totalDevices <= 2000) {
      staffCount = 5;
    } else if (totalDevices > 2000 && totalDevices <= 5000) {
      staffCount = 12;
    } else if (totalDevices > 5000 && totalDevices <= 10000) {
      staffCount = 25;
    } else if (totalDevices > 10000) {
      staffCount = Math.ceil(totalDevices / 350); // Approximate 1:350 ratio
    }
    
    setComparisonInputs(prev => ({
      ...prev,
      itStaffCount: staffCount
    }));
  }, [totalDevices]);
  
  // Handle input changes
  const handleDeviceChange = (e) => {
    const { name, value } = e.target;
    setDevices({
      ...devices,
      [name]: value
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
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
     
<header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 shadow-lg mb-4">
  <div className="container mx-auto px-4 flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold">MSP Pricing Calculator</h1>
      <p className="text-blue-100 text-sm">Optimize your managed service pricing strategy</p>
    </div>
    <UserInfo />
  </div>
</header>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-blue-800 text-white px-6 py-4">
                <h2 className="text-xl font-semibold">Environment Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="workstations" className="block text-sm font-medium text-gray-700 mb-1">
                      Workstations
                    </label>
                    <input
                      type="number"
                      id="workstations"
                      name="workstations"
                      value={devices.workstations}
                      onChange={handleDeviceChange}
                      min="0"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="physicalServers" className="block text-sm font-medium text-gray-700 mb-1">
                      Physical Servers
                    </label>
                    <input
                      type="number"
                      id="physicalServers"
                      name="physicalServers"
                      value={devices.physicalServers}
                      onChange={handleDeviceChange}
                      min="0"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="virtualServers" className="block text-sm font-medium text-gray-700 mb-1">
                      Virtual Servers
                    </label>
                    <input
                      type="number"
                      id="virtualServers"
                      name="virtualServers"
                      value={devices.virtualServers}
                      onChange={handleDeviceChange}
                      min="0"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="networkDevices" className="block text-sm font-medium text-gray-700 mb-1">
                      Network Devices
                    </label>
                    <input
                      type="number"
                      id="networkDevices"
                      name="networkDevices"
                      value={devices.networkDevices}
                      onChange={handleDeviceChange}
                      min="0"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total Devices:</span>
                      <span className="text-blue-800 font-bold">{totalDevices.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-1">
                      <span>Environment Size:</span>
                      <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold">{tier}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-800 text-white px-6 py-4">
                <h2 className="text-xl font-semibold">Service Options</h2>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="serviceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Level
                    </label>
                    <select
                      id="serviceLevel"
                      value={serviceLevel}
                      onChange={(e) => setServiceLevel(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="monitorOnly">Monitor Only (80%)</option>
                      <option value="monitorBasic">Monitor + Basic Remediation (90%)</option>
                      <option value="monitorRemediation">Monitor + Remediation (100%)</option>
                      <option value="advancedManagement">Advanced Management (115%)</option>
                      <option value="fullyManaged">Fully Managed Support (130%)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="contractTerm" className="block text-sm font-medium text-gray-700 mb-1">
                      Contract Term
                    </label>
                    <select
                      id="contractTerm"
                      value={contractTerm}
                      onChange={(e) => setContractTerm(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="1year">1 Year (5% discount)</option>
                      <option value="2year">2 Years (10% discount)</option>
                      <option value="3year">3 Years (15% discount)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Frequency
                    </label>
                    <select
                      id="paymentFrequency"
                      value={paymentFrequency}
                      onChange={(e) => setPaymentFrequency(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual (5-12% discount)</option>
                    </select>
                  </div>
                  
                  {/* NEW: Usage Factor input for flexible, consumption-based pricing */}
                  <div>
                    <label htmlFor="usageFactor" className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Factor (Consumption-Based)
                    </label>
                    <input
                      type="number"
                      id="usageFactor"
                      name="usageFactor"
                      value={usageFactor}
                      onChange={(e) => setUsageFactor(parseFloat(e.target.value))}
                      min="0"
                      step="0.1"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bundleOption" className="block text-sm font-medium text-gray-700 mb-1">
                      Bundle Option
                    </label>
                    <select
                      id="bundleOption"
                      value={selectedBundle}
                      onChange={(e) => setSelectedBundle(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="none">No Bundle</option>
                      <option value="enterpriseSecurity">Enterprise Security Bundle (10% discount)</option>
                      <option value="enterpriseBackup">Enterprise Backup Bundle (5% discount)</option>
                      <option value="enterpriseComplete">Enterprise Complete Bundle (15% discount)</option>
                    </select>
                    {selectedBundle !== 'none' && (
                      <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                        {selectedBundle === 'enterpriseSecurity' && "Includes RMM + Managed SOC"}
                        {selectedBundle === 'enterpriseBackup' && "Includes RMM + Cove Data Protect"}
                        {selectedBundle === 'enterpriseComplete' && "Includes RMM + SOC + Backup + DNS"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {/* Main pricing summary card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Pricing Summary</h2>
                <div className="bg-blue-900 py-1 px-3 rounded-lg shadow-sm">
                  <span className="text-xs font-medium text-blue-200">ENVIRONMENT SIZE</span>
                  <div className="text-xl font-bold">{tier}</div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Primary pricing metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-800 font-medium">Monthly Price</div>
                    <div className="text-3xl font-bold text-blue-900 mt-1">{formatCurrency(finalMonthlyCost)}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-800 font-medium">Annual Price</div>
                    <div className="text-3xl font-bold text-blue-900 mt-1">{formatCurrency(annualCost)}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-800 font-medium">Price Per Device</div>
                    <div className="text-3xl font-bold text-blue-900 mt-1">{formatCurrency(perDeviceCost)}</div>
                  </div>
                </div>
                
                {/* Environment details & cost factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200">Environment Details</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-gray-600">Total Devices:</div>
                      <div className="font-medium text-right">{totalDevices.toLocaleString()}</div>
                      
                      <div className="text-gray-600">Service Level:</div>
                      <div className="font-medium text-right">
                        {serviceLevel === 'monitorOnly' && 'Monitor Only'}
                        {serviceLevel === 'monitorBasic' && 'Monitor + Basic'}
                        {serviceLevel === 'monitorRemediation' && 'Monitor + Remediation'}
                        {serviceLevel === 'advancedManagement' && 'Advanced Management'}
                        {serviceLevel === 'fullyManaged' && 'Fully Managed'}
                      </div>
                      
                      <div className="text-gray-600">Contract Term:</div>
                      <div className="font-medium text-right">
                        {contractTerm === '1year' && '1 Year'}
                        {contractTerm === '2year' && '2 Years'}
                        {contractTerm === '3year' && '3 Years'}
                      </div>
                      
                      <div className="text-gray-600">Payment:</div>
                      <div className="font-medium text-right capitalize">{paymentFrequency}</div>
                      
                      <div className="text-gray-600">Bundle:</div>
                      <div className="font-medium text-right">{appliedBundle || 'None'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200">Cost Factors</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-gray-600">Efficiency Factor:</div>
                      <div className="font-medium text-right">{formatPercentage(efficiencyFactor * 100)}</div>
                      
                      <div className="text-gray-600">Service Level Impact:</div>
                      <div className="font-medium text-right">{formatPercentage((serviceLevelMultiplier - 1) * 100)}</div>
                      
                      <div className="text-gray-600">Contract Discount:</div>
                      <div className="font-medium text-right">{formatPercentage(contractDiscount * 100)}</div>
                      
                      <div className="text-gray-600">Payment Discount:</div>
                      <div className="font-medium text-right">{formatPercentage(paymentDiscount * 100)}</div>
                      
                      <div className="text-gray-600">Bundle Discount:</div>
                      <div className="font-medium text-right">{formatPercentage(bundleDiscount * 100)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Cost breakdown section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200">Cost Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Labor Costs</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Hours:</span>
                          <span className="font-medium">{totalServiceHours.toFixed(1)} hours/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Offshore ({formatPercentage(offshorePercentage * 100)}):</span>
                          <span className="font-medium">{offshoreHours.toFixed(1)} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">US-Based ({formatPercentage(usBasedPercentage * 100)}):</span>
                          <span className="font-medium">{usBasedHours.toFixed(1)} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Architect ({formatPercentage(architectPercentage * 100)}):</span>
                          <span className="font-medium">{architectHours.toFixed(1)} hours</span>
                        </div>
                        <div className="pt-1 border-t border-gray-200 flex justify-between font-semibold">
                          <span>Total Labor Cost:</span>
                          <span>{formatCurrency(laborCost)}/month</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Tooling Costs</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">RMM ({formatCurrency(rmmRate)}/device):</span>
                          <span className="font-medium">{formatCurrency(rmmCost)}/month</span>
                        </div>
                        
                        {isSecurityBundle && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">SOC ({formatCurrency(socRate)}/device):</span>
                            <span className="font-medium">{formatCurrency(socCost)}/month</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Tooling Cost:</span>
                          <span className="font-medium">{formatCurrency(baseToolingCost)}/month</span>
                        </div>
                        {bundleDiscount > 0 && (
                          <div className="flex justify-between text-green-700">
                            <span>Bundle Discount:</span>
                            <span>-{formatPercentage(bundleDiscount * 100)}</span>
                          </div>
                        )}
                        <div className="pt-1 border-t border-gray-200 flex justify-between font-semibold">
                          <span>Final Tooling Cost:</span>
                          <span>{formatCurrency(discountedToolingCost)}/month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Profitability metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Base Cost Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Base Cost (Fixed + Consumption):</span>
                        <span className="font-medium">{formatCurrency(hybridBaseCost)}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Profit Margin:</span>
                        <span className="font-medium">{formatPercentage(profitMargin * 100)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>With Margin:</span>
                        <span>{formatCurrency(withProfitMargin)}/month</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Discount Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Contract Discount:</span>
                        <span className="font-medium">-{formatPercentage(contractDiscount * 100)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Payment Discount:</span>
                        <span className="font-medium">-{formatPercentage(paymentDiscount * 100)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Final Price:</span>
                        <span>{formatCurrency(finalMonthlyCost)}/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Industry Comparison Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Industry Comparison</h2>
                <button 
                  onClick={() => setShowComparison(!showComparison)} 
                  className="bg-white text-blue-800 hover:bg-blue-100 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  {showComparison ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              <div className="p-6">
                {/* Comparison settings */}
                {showComparison && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Comparison Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="itStaffCount" className="block text-sm font-medium text-gray-700 mb-1">
                          IT Staff Count
                        </label>
                        <input
                          type="number"
                          id="itStaffCount"
                          name="itStaffCount"
                          value={comparisonInputs.itStaffCount}
                          onChange={handleComparisonChange}
                          min="1"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="averageSalary" className="block text-sm font-medium text-gray-700 mb-1">
                          Average IT Salary ($)
                        </label>
                        <input
                          type="number"
                          id="averageSalary"
                          name="averageSalary"
                          value={comparisonInputs.averageSalary}
                          onChange={handleComparisonChange}
                          min="0"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                          Benefits (% of Salary)
                        </label>
                        <input
                          type="number"
                          id="benefits"
                          name="benefits"
                          value={comparisonInputs.benefits}
                          onChange={handleComparisonChange}
                          min="0"
                          max="100"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="overhead" className="block text-sm font-medium text-gray-700 mb-1">
                          Overhead (% of Salary)
                        </label>
                        <input
                          type="number"
                          id="overhead"
                          name="overhead"
                          value={comparisonInputs.overhead}
                          onChange={handleComparisonChange}
                          min="0"
                          max="100"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="competitorPrice" className="block text-sm font-medium text-gray-700 mb-1">
                          Competitor Price ($/device)
                        </label>
                        <input
                          type="number"
                          id="competitorPrice"
                          name="competitorPrice"
                          value={comparisonInputs.competitorPrice}
                          onChange={handleComparisonChange}
                          min="0"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Comparison costs & savings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Our Pricing</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Monthly:</span>
                        <span className="font-medium">{formatCurrency(finalMonthlyCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Annual:</span>
                        <span className="font-medium">{formatCurrency(annualCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Per Device:</span>
                        <span className="font-medium">{formatCurrency(perDeviceCost)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">In-House IT Cost</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Monthly:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.inHouse.monthlyCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Annual:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.inHouse.annualCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Per Device:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.inHouse.costPerDevice)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Competitor MSP Cost</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Monthly:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.competitor.monthlyCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Annual:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.competitor.annualCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Per Device:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.competitor.costPerDevice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Savings section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Savings vs. In-House IT</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Monthly Savings:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.savings.inHouse.monthly)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Annual Savings:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.savings.inHouse.annual)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-green-700 mt-1 pt-1 border-t border-green-200">
                        <span>Percentage Savings:</span>
                        <span>{formatPercentage(comparisonData.savings.inHouse.percentage)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Savings vs. Competitor MSP</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Monthly Savings:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.savings.competitor.monthly)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Annual Savings:</span>
                        <span className="font-medium">{formatCurrency(comparisonData.savings.competitor.annual)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-green-700 mt-1 pt-1 border-t border-green-200">
                        <span>Percentage Savings:</span>
                        <span>{formatPercentage(comparisonData.savings.competitor.percentage)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-600">
        <div className="container mx-auto px-4">
          <p>MSP Pricing Calculator &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;