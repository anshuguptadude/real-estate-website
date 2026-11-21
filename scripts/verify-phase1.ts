import { generateLuxuryDossierHtml } from '../src/utils/dossierGenerator';
import { isValidClientLead, LeadSubmission } from '../src/utils/security';
import { Project } from '../src/types';

function runTests() {
  console.log('--- Starting Phase 1 Feature Verification Tests ---');

  // Test 1: Dossier Generator
  const sampleProject: Project = {
    id: 'proj-royal-palm',
    name: 'Anupam Royal Palm',
    developer: 'Anupam Housing Ltd',
    locality: 'Fatehabad Road, Agra',
    priceStarting: '₹1.85 Cr onwards',
    units: '64 Ultra-Luxury Residences',
    status: 'Under Construction',
    possessionDate: 'March 2027',
    reraNumber: 'UPRERAAGT2024/7821',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
    description: 'A benchmark development featuring panoramic Taj Mahal corridor views and five-star club facilities.',
    highlights: ['Corridor Views', 'Private Lift Lobby', 'Clubhouse & Heated Pool'],
    totalArea: '5.2 Acres Private Estate',
    unitConfigurations: ['3 BHK Sky Villa (2,450 sq.ft)', '4 BHK Presidential (3,800 sq.ft)']
  };

  const clientName = 'Vikramaditya Singhal';
  const clientPhone = '9876543210';
  const html = generateLuxuryDossierHtml(sampleProject, clientName, clientPhone);

  if (!html.startsWith('<!DOCTYPE html>')) throw new Error('Dossier HTML does not start with <!DOCTYPE html>');
  if (!html.includes('Anupam Royal Palm')) throw new Error('Dossier HTML missing project name');
  if (!html.includes('UPRERAAGT2024/7821')) throw new Error('Dossier HTML missing RERA number');
  if (!html.includes('Vikramaditya Singhal')) throw new Error('Dossier HTML missing client name');
  if (!html.includes('9876543210')) throw new Error('Dossier HTML missing client phone');
  if (!html.includes('window.print()')) throw new Error('Dossier HTML missing print action button');
  if (!html.includes('@media print')) throw new Error('Dossier HTML missing print stylesheet');
  console.log('✓ Test 1 Passed: Luxury Digital Dossier HTML generation is complete and valid.');

  // Test 2: HTML Escaping for Security
  const maliciousProject: Project = {
    ...sampleProject,
    name: 'Royal <script>alert("xss")</script> & Towers'
  };
  const escapedHtml = generateLuxuryDossierHtml(maliciousProject, '<script>', '9876543210');
  if (escapedHtml.includes('<script>alert("xss")</script>')) {
    throw new Error('XSS vulnerability: unescaped script tag found in HTML');
  }
  if (!escapedHtml.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')) {
    throw new Error('HTML entities not properly escaped');
  }
  console.log('✓ Test 2 Passed: HTML escaping correctly sanitizes malicious inputs.');

  // Test 3: Lead Validation - Home Loan Pre-Approval Lead
  const homeLoanLead: LeadSubmission = {
    id: `LEAD-${Date.now()}`,
    propertyId: 'home-loan-dsa',
    propertyTitle: 'Home Loan Pre-Approval: SBI (₹1.50 Cr)',
    buyerName: 'Dr. Alok Verma',
    phone: '9811223344',
    email: 'alok.verma@example.com',
    preferredTime: 'Pre-Approved Loan: SBI | Loan: ₹1.50 Cr | EMI: ₹1,29,864/mo | Tenure: 20 Yrs',
    timestamp: new Date().toLocaleString(),
    createdAt: new Date().toISOString(),
    status: 'new',
    inquiryType: 'Home Loan Assistance',
    loanAmount: 15000000,
    tenureYears: 20,
    interestRate: 8.5,
    calculatedEmi: 129864,
    preferredBank: 'SBI'
  };
  if (!isValidClientLead(homeLoanLead)) {
    throw new Error('Valid Home Loan lead was rejected by isValidClientLead');
  }
  console.log('✓ Test 3 Passed: Home Loan Pre-Approval lead conforms to isValidClientLead.');

  // Test 4: Lead Validation - Project Brochure Download Lead
  const brochureLead: LeadSubmission = {
    id: `LEAD-${Date.now()}`,
    propertyId: 'project-proj-royal-palm',
    propertyTitle: 'Project Brochure: Anupam Royal Palm',
    buyerName: 'Kavita Bansal',
    phone: '8765432109',
    email: 'kavita@bansalexports.in',
    preferredTime: 'Dossier Download | Timeline: Immediate Purchase (< 30 Days) | Project: Anupam Royal Palm | Locality: Fatehabad Road, Agra',
    timestamp: new Date().toLocaleString(),
    createdAt: new Date().toISOString(),
    status: 'new',
    inquiryType: 'Project Brochure Download',
    projectTitle: 'Anupam Royal Palm',
    timeline: 'Immediate Purchase (< 30 Days)'
  };
  if (!isValidClientLead(brochureLead)) {
    throw new Error('Valid Project Brochure lead was rejected by isValidClientLead');
  }
  console.log('✓ Test 4 Passed: Project Brochure Download lead conforms to isValidClientLead.');

  // Test 5: Rejection of Invalid / Placeholder Leads
  const invalidCases: Partial<LeadSubmission>[] = [
    { buyerName: 'Prospective Buyer', phone: '9876543210', email: 'test@example.com' },
    { buyerName: 'Real Client', phone: '9149079913', email: 'test@example.com' }, // Owner 1
    { buyerName: 'Real Client', phone: '9557138449', email: 'test@example.com' }, // Owner 2
    { buyerName: 'Real Client', phone: '12345', email: 'test@example.com' }, // Short phone
    { buyerName: 'Real Client', phone: '9876543210', email: 'buyer@royalagraestate.in' } // Dummy email
  ];
  for (const inv of invalidCases) {
    if (isValidClientLead(inv)) {
      throw new Error(`Invalid lead was accepted: ${JSON.stringify(inv)}`);
    }
  }
  console.log('✓ Test 5 Passed: All invalid, dummy, and owner lines correctly rejected.');

  console.log('--- All 5 Verification Tests Passed Successfully! ---');
}

runTests();
