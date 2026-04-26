-- =============================================
-- ENTERPRISE ERP SYSTEM - DATABASE SCHEMA
-- Multi-tenant Architecture
-- Saudi Arabia Compliant
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =============================================
-- CORE TENANCY & AUTHENTICATION
-- =============================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    domain VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    settings JSONB DEFAULT '{}'::jsonb,
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    subscription_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    permissions JSONB DEFAULT '[]'::jsonb,
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id),
    employee_id UUID, -- Links to HR employee
    full_name VARCHAR(255),
    full_name_ar VARCHAR(255),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, username),
    UNIQUE(tenant_id, email)
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- HR & HUMAN CAPITAL MANAGEMENT MODULE
-- =============================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    vat_number VARCHAR(50),
    cr_number VARCHAR(50),
    address TEXT,
    address_ar TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Saudi Arabia',
    phone VARCHAR(20),
    email VARCHAR(255),
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, code)
);

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    location VARCHAR(255),
    city VARCHAR(100),
    manager_id UUID,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, code)
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES departments(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    head_id UUID,
    cost_center_code VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, code)
);

CREATE TABLE job_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255),
    job_grade VARCHAR(50),
    job_family VARCHAR(100),
    description TEXT,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, code)
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    branch_id UUID REFERENCES branches(id),
    department_id UUID REFERENCES departments(id),
    job_position_id UUID REFERENCES job_positions(id),
    employee_number VARCHAR(50) NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    first_name_ar VARCHAR(100),
    middle_name_ar VARCHAR(100),
    last_name_ar VARCHAR(100),
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || COALESCE(middle_name || ' ', '') || last_name) STORED,
    full_name_ar VARCHAR(255),
    
    -- Identity
    nationality VARCHAR(100),
    national_id VARCHAR(50),
    iqama_number VARCHAR(50),
    iqama_expiry_date DATE,
    passport_number VARCHAR(50),
    passport_expiry_date DATE,
    border_number VARCHAR(50),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Employment
    hire_date DATE NOT NULL,
    hire_date_hijri VARCHAR(20),
    employment_type VARCHAR(50), -- Full-time, Part-time, Contract, Temporary
    contract_type VARCHAR(50),
    probation_end_date DATE,
    confirmation_date DATE,
    sponsor_id VARCHAR(50),
    
    -- Work Details
    manager_id UUID REFERENCES employees(id),
    work_location VARCHAR(255),
    shift_pattern VARCHAR(50),
    
    -- Financial
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    iban VARCHAR(50),
    basic_salary DECIMAL(15,2),
    
    -- Status
    employment_status VARCHAR(50) DEFAULT 'active', -- active, resigned, terminated, on_leave
    termination_date DATE,
    termination_reason TEXT,
    
    -- GOSI & Saudi Compliance
    gosi_number VARCHAR(50),
    is_saudi BOOLEAN DEFAULT false,
    saudization_category VARCHAR(50),
    
    -- System
    photo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    UNIQUE(tenant_id, employee_number)
);

CREATE TABLE employee_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- iqama, passport, contract, certificate, etc.
    document_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    issue_date DATE,
    expiry_date DATE,
    notes TEXT,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    attendance_date_hijri VARCHAR(20),
    
    -- Time Records
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    check_in_location VARCHAR(255),
    check_out_location VARCHAR(255),
    check_in_ip INET,
    check_out_ip INET,
    
    -- Duration
    working_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2),
    break_hours DECIMAL(5,2),
    
    -- Status
    status VARCHAR(50), -- present, absent, late, early_leave, on_leave, weekend, holiday
    is_late BOOLEAN DEFAULT false,
    late_minutes INTEGER,
    is_early_leave BOOLEAN DEFAULT false,
    early_leave_minutes INTEGER,
    
    -- Shift
    shift_id UUID,
    scheduled_in TIME,
    scheduled_out TIME,
    
    -- Approval
    is_regularized BOOLEAN DEFAULT false,
    regularization_reason TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, employee_id, attendance_date)
);

CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    
    -- Accrual Rules
    annual_entitlement DECIMAL(5,2), -- Days per year
    accrual_method VARCHAR(50), -- monthly, yearly, none
    
    -- Restrictions
    max_days_per_request INTEGER,
    min_days_notice INTEGER,
    is_paid BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT true,
    carry_forward_allowed BOOLEAN DEFAULT false,
    max_carry_forward_days INTEGER,
    
    -- Encashment
    encashment_allowed BOOLEAN DEFAULT false,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, code)
);

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES leave_types(id),
    
    -- Request Details
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    from_date_hijri VARCHAR(20),
    to_date_hijri VARCHAR(20),
    total_days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    
    -- Approval
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    requested_by UUID REFERENCES users(id),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Balance Impact
    balance_before DECIMAL(5,2),
    balance_after DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payroll_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    period_name VARCHAR(100) NOT NULL, -- Jan 2024, Feb 2024
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_date_hijri VARCHAR(20),
    end_date_hijri VARCHAR(20),
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, processing, approved, paid
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, period_name)
);

CREATE TABLE payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    period_id UUID REFERENCES payroll_periods(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Salary Components
    basic_salary DECIMAL(15,2) DEFAULT 0,
    
    -- Earnings
    housing_allowance DECIMAL(15,2) DEFAULT 0,
    transport_allowance DECIMAL(15,2) DEFAULT 0,
    food_allowance DECIMAL(15,2) DEFAULT 0,
    other_allowances DECIMAL(15,2) DEFAULT 0,
    overtime_amount DECIMAL(15,2) DEFAULT 0,
    bonus DECIMAL(15,2) DEFAULT 0,
    commission DECIMAL(15,2) DEFAULT 0,
    
    gross_salary DECIMAL(15,2) GENERATED ALWAYS AS (
        basic_salary + housing_allowance + transport_allowance + 
        food_allowance + other_allowances + overtime_amount + bonus + commission
    ) STORED,
    
    -- Deductions
    gosi_employee DECIMAL(15,2) DEFAULT 0,
    loan_deduction DECIMAL(15,2) DEFAULT 0,
    advance_deduction DECIMAL(15,2) DEFAULT 0,
    absence_deduction DECIMAL(15,2) DEFAULT 0,
    late_deduction DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    
    total_deductions DECIMAL(15,2) GENERATED ALWAYS AS (
        gosi_employee + loan_deduction + advance_deduction + 
        absence_deduction + late_deduction + other_deductions
    ) STORED,
    
    -- Net Salary
    net_salary DECIMAL(15,2) GENERATED ALWAYS AS (
        basic_salary + housing_allowance + transport_allowance + 
        food_allowance + other_allowances + overtime_amount + bonus + commission -
        (gosi_employee + loan_deduction + advance_deduction + 
         absence_deduction + late_deduction + other_deductions)
    ) STORED,
    
    -- GOSI Employer Contribution
    gosi_employer DECIMAL(15,2) DEFAULT 0,
    
    -- Days Worked
    working_days INTEGER,
    days_present INTEGER,
    days_absent INTEGER,
    overtime_hours DECIMAL(5,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft',
    paid_on DATE,
    payment_method VARCHAR(50), -- bank_transfer, cash, check
    payment_reference VARCHAR(100),
    
    -- Notes
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, period_id, employee_id)
);

-- =============================================
-- FINANCE & ACCOUNTING MODULE
-- =============================================

CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    account_code VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_name_ar VARCHAR(255),
    parent_id UUID REFERENCES chart_of_accounts(id),
    
    -- Classification
    account_type VARCHAR(50) NOT NULL, -- asset, liability, equity, revenue, expense
    account_category VARCHAR(100), -- current_asset, fixed_asset, current_liability, etc.
    
    -- Nature
    normal_balance VARCHAR(10), -- debit, credit
    is_header BOOLEAN DEFAULT false,
    is_control_account BOOLEAN DEFAULT false,
    
    -- Subsidiary Ledger Links
    linked_module VARCHAR(50), -- customers, vendors, employees, projects
    
    -- Settings
    allow_manual_entry BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    currency VARCHAR(3) DEFAULT 'SAR',
    
    -- Balance
    opening_balance DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, account_code)
);

CREATE TABLE cost_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    parent_id UUID REFERENCES cost_centers(id),
    manager_id UUID REFERENCES employees(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, code)
);

CREATE TABLE fiscal_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    year_name VARCHAR(50) NOT NULL, -- 2024, FY2024, etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_date_hijri VARCHAR(20),
    end_date_hijri VARCHAR(20),
    is_closed BOOLEAN DEFAULT false,
    closed_by UUID REFERENCES users(id),
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, year_name)
);

CREATE TABLE accounting_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    fiscal_year_id UUID REFERENCES fiscal_years(id) ON DELETE CASCADE,
    period_number INTEGER NOT NULL,
    period_name VARCHAR(50) NOT NULL, -- Jan 2024
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_closed BOOLEAN DEFAULT false,
    closed_by UUID REFERENCES users(id),
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, fiscal_year_id, period_number)
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    entry_number VARCHAR(50) NOT NULL,
    fiscal_year_id UUID REFERENCES fiscal_years(id),
    period_id UUID REFERENCES accounting_periods(id),
    
    -- Dates
    entry_date DATE NOT NULL,
    entry_date_hijri VARCHAR(20),
    posting_date DATE,
    
    -- Classification
    entry_type VARCHAR(50), -- manual, system, opening, closing, adjustment
    journal_type VARCHAR(50), -- general, sales, purchase, cash, bank
    
    -- Reference
    reference_number VARCHAR(100),
    reference_type VARCHAR(50), -- invoice, payment, payroll, etc.
    reference_id UUID,
    
    -- Description
    description TEXT NOT NULL,
    notes TEXT,
    
    -- Totals
    total_debit DECIMAL(15,2) DEFAULT 0,
    total_credit DECIMAL(15,2) DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, posted, approved, cancelled
    posted_by UUID REFERENCES users(id),
    posted_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    -- Reversal
    is_reversed BOOLEAN DEFAULT false,
    reversed_entry_id UUID REFERENCES journal_entries(id),
    reversal_date DATE,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, entry_number)
);

CREATE TABLE journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    
    -- Account
    account_id UUID REFERENCES chart_of_accounts(id) NOT NULL,
    
    -- Amounts
    debit DECIMAL(15,2) DEFAULT 0,
    credit DECIMAL(15,2) DEFAULT 0,
    
    -- Analytics
    cost_center_id UUID REFERENCES cost_centers(id),
    project_id UUID,
    
    -- Subsidiary Ledger
    party_type VARCHAR(50), -- customer, vendor, employee
    party_id UUID,
    
    -- Description
    description TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_debit_or_credit CHECK (
        (debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)
    )
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    customer_code VARCHAR(50) NOT NULL,
    
    -- Basic Info
    customer_name VARCHAR(255) NOT NULL,
    customer_name_ar VARCHAR(255),
    customer_type VARCHAR(50), -- individual, company, government
    
    -- Tax Info
    vat_number VARCHAR(50),
    cr_number VARCHAR(50),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    website VARCHAR(255),
    
    -- Address
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Saudi Arabia',
    postal_code VARCHAR(20),
    
    -- Financial
    receivable_account_id UUID REFERENCES chart_of_accounts(id),
    credit_limit DECIMAL(15,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 30, -- Days
    
    -- Classification
    territory VARCHAR(100),
    industry VARCHAR(100),
    customer_group VARCHAR(100),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    UNIQUE(tenant_id, customer_code)
);

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    vendor_code VARCHAR(50) NOT NULL,
    
    -- Basic Info
    vendor_name VARCHAR(255) NOT NULL,
    vendor_name_ar VARCHAR(255),
    vendor_type VARCHAR(50), -- supplier, contractor, service_provider
    
    -- Tax Info
    vat_number VARCHAR(50),
    cr_number VARCHAR(50),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    website VARCHAR(255),
    
    -- Address
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    
    -- Financial
    payable_account_id UUID REFERENCES chart_of_accounts(id),
    payment_terms INTEGER DEFAULT 30,
    
    -- Banking
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    iban VARCHAR(50),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, vendor_code)
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    invoice_type VARCHAR(50) NOT NULL, -- sales, purchase
    
    -- Party
    customer_id UUID REFERENCES customers(id),
    vendor_id UUID REFERENCES vendors(id),
    
    -- Dates
    invoice_date DATE NOT NULL,
    invoice_date_hijri VARCHAR(20),
    due_date DATE,
    
    -- Reference
    reference_number VARCHAR(100),
    po_number VARCHAR(100),
    project_id UUID,
    
    -- Amounts
    subtotal DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    vat_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    balance_amount DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    
    -- VAT
    vat_rate DECIMAL(5,2) DEFAULT 15,
    is_vat_inclusive BOOLEAN DEFAULT false,
    
    -- ZATCA E-invoicing
    zatca_uuid UUID,
    zatca_hash VARCHAR(500),
    zatca_qr_code TEXT,
    zatca_status VARCHAR(50), -- not_submitted, submitted, approved, rejected
    zatca_submitted_at TIMESTAMP,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved, paid, cancelled
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partially_paid, paid
    
    -- Journal Entry
    journal_entry_id UUID REFERENCES journal_entries(id),
    
    -- Notes
    terms_and_conditions TEXT,
    notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, invoice_number)
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    
    -- Item
    item_code VARCHAR(100),
    description TEXT NOT NULL,
    description_ar TEXT,
    
    -- Quantity & Pricing
    quantity DECIMAL(15,3) DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Amounts
    line_total DECIMAL(15,2) GENERATED ALWAYS AS (
        (quantity * unit_price) - discount_amount
    ) STORED,
    vat_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (
        ((quantity * unit_price) - discount_amount) + vat_amount
    ) STORED,
    
    -- Tax
    vat_rate DECIMAL(5,2) DEFAULT 15,
    is_vat_exempt BOOLEAN DEFAULT false,
    
    -- Analytics
    cost_center_id UUID REFERENCES cost_centers(id),
    project_id UUID,
    account_id UUID REFERENCES chart_of_accounts(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    payment_number VARCHAR(50) NOT NULL,
    payment_type VARCHAR(50) NOT NULL, -- receipt, payment
    
    -- Party
    customer_id UUID REFERENCES customers(id),
    vendor_id UUID REFERENCES vendors(id),
    
    -- Payment Details
    payment_date DATE NOT NULL,
    payment_date_hijri VARCHAR(20),
    amount DECIMAL(15,2) NOT NULL,
    
    -- Method
    payment_method VARCHAR(50) NOT NULL, -- cash, bank_transfer, check, credit_card
    bank_account_id UUID REFERENCES chart_of_accounts(id),
    reference_number VARCHAR(100),
    check_number VARCHAR(100),
    check_date DATE,
    
    -- Allocation
    invoice_id UUID REFERENCES invoices(id),
    allocated_amount DECIMAL(15,2),
    
    -- Journal
    journal_entry_id UUID REFERENCES journal_entries(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, posted, cleared, cancelled
    
    notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, payment_number)
);

-- =============================================
-- CRM MODULE
-- =============================================

CREATE TABLE crm_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

CREATE TABLE crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    lead_number VARCHAR(50) NOT NULL,
    
    -- Lead Info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    job_title VARCHAR(100),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    website VARCHAR(255),
    
    -- Classification
    industry VARCHAR(100),
    lead_source_id UUID REFERENCES crm_sources(id),
    territory VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, converted, lost
    lead_score INTEGER DEFAULT 0,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    
    -- Conversion
    is_converted BOOLEAN DEFAULT false,
    converted_to_account_id UUID,
    converted_to_contact_id UUID,
    converted_to_opportunity_id UUID,
    converted_at TIMESTAMP,
    converted_by UUID REFERENCES users(id),
    
    -- Notes
    notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, lead_number)
);

CREATE TABLE crm_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    account_number VARCHAR(50) NOT NULL,
    
    -- Account Info
    account_name VARCHAR(255) NOT NULL,
    account_name_ar VARCHAR(255),
    account_type VARCHAR(50), -- customer, prospect, partner
    
    -- Tax Info
    vat_number VARCHAR(50),
    cr_number VARCHAR(50),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Address
    billing_address TEXT,
    shipping_address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Saudi Arabia',
    
    -- Classification
    industry VARCHAR(100),
    territory VARCHAR(100),
    annual_revenue DECIMAL(15,2),
    number_of_employees INTEGER,
    
    -- Relationship
    parent_account_id UUID REFERENCES crm_accounts(id),
    account_owner_id UUID REFERENCES users(id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Link to Customer Master
    customer_id UUID REFERENCES customers(id),
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, account_number)
);

CREATE TABLE crm_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    account_id UUID REFERENCES crm_accounts(id),
    
    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100),
    department VARCHAR(100),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    
    -- Classification
    contact_type VARCHAR(50), -- decision_maker, influencer, user
    is_primary BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crm_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    opportunity_number VARCHAR(50) NOT NULL,
    
    -- Opportunity Info
    opportunity_name VARCHAR(255) NOT NULL,
    account_id UUID REFERENCES crm_accounts(id),
    contact_id UUID REFERENCES crm_contacts(id),
    
    -- Financial
    amount DECIMAL(15,2),
    probability INTEGER DEFAULT 50, -- 0-100%
    expected_revenue DECIMAL(15,2) GENERATED ALWAYS AS (amount * probability / 100) STORED,
    
    -- Timing
    expected_close_date DATE,
    
    -- Classification
    stage VARCHAR(50) DEFAULT 'qualification', -- qualification, proposal, negotiation, won, lost
    lead_source_id UUID REFERENCES crm_sources(id),
    opportunity_type VARCHAR(50), -- new_business, existing_customer, renewal
    
    -- Competition
    competitors TEXT,
    
    -- Assignment
    owner_id UUID REFERENCES users(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'open', -- open, won, lost, cancelled
    win_loss_reason TEXT,
    closed_date DATE,
    
    -- Conversion
    converted_to_project_id UUID,
    
    notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, opportunity_number)
);

-- =============================================
-- PROJECTS & CONTRACTING MODULE
-- =============================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    project_code VARCHAR(50) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_name_ar VARCHAR(255),
    
    -- Client
    client_id UUID REFERENCES customers(id),
    client_contact_id UUID REFERENCES crm_contacts(id),
    
    -- Contract
    contract_number VARCHAR(100),
    contract_value DECIMAL(15,2),
    contract_start_date DATE,
    contract_end_date DATE,
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    
    -- Budget
    budgeted_cost DECIMAL(15,2) DEFAULT 0,
    actual_cost DECIMAL(15,2) DEFAULT 0,
    variance DECIMAL(15,2) GENERATED ALWAYS AS (budgeted_cost - actual_cost) STORED,
    
    -- Progress
    planned_progress DECIMAL(5,2) DEFAULT 0, -- Percentage
    actual_progress DECIMAL(5,2) DEFAULT 0,
    
    -- Location
    project_location VARCHAR(255),
    city VARCHAR(100),
    region VARCHAR(100),
    
    -- Classification
    project_type VARCHAR(50), -- construction, maintenance, consulting
    project_category VARCHAR(100),
    
    -- Team
    project_manager_id UUID REFERENCES employees(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'planning', -- planning, in_progress, on_hold, completed, cancelled
    
    -- Financial Tracking
    billed_amount DECIMAL(15,2) DEFAULT 0,
    received_amount DECIMAL(15,2) DEFAULT 0,
    
    notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, project_code)
);

CREATE TABLE project_boq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- BOQ Structure
    item_code VARCHAR(50) NOT NULL,
    parent_item_id UUID REFERENCES project_boq(id),
    item_number VARCHAR(50),
    
    -- Description
    description TEXT NOT NULL,
    description_ar TEXT,
    
    -- Quantity & Unit
    quantity DECIMAL(15,3) DEFAULT 0,
    unit VARCHAR(50),
    
    -- Pricing
    unit_price DECIMAL(15,2) DEFAULT 0,
    total_price DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    
    -- Progress
    completed_quantity DECIMAL(15,3) DEFAULT 0,
    progress_percent DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN quantity > 0 THEN (completed_quantity / quantity * 100) ELSE 0 END
    ) STORED,
    
    -- Status
    is_header BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, project_id, item_code)
);

CREATE TABLE project_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Cost Classification
    cost_code VARCHAR(50) NOT NULL,
    cost_type VARCHAR(50) NOT NULL, -- labor, material, equipment, subcontract, overhead
    
    -- Description
    description TEXT,
    
    -- Budget
    budgeted_amount DECIMAL(15,2) DEFAULT 0,
    committed_amount DECIMAL(15,2) DEFAULT 0,
    actual_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Variance
    variance DECIMAL(15,2) GENERATED ALWAYS AS (budgeted_amount - actual_amount) STORED,
    
    -- Analytics
    cost_center_id UUID REFERENCES cost_centers(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, project_id, cost_code)
);

CREATE TABLE project_progress_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Claim Details
    claim_number VARCHAR(50) NOT NULL,
    claim_period VARCHAR(100), -- Month/Year or custom period
    claim_date DATE NOT NULL,
    
    -- Progress
    previous_progress_percent DECIMAL(5,2) DEFAULT 0,
    current_progress_percent DECIMAL(5,2) DEFAULT 0,
    progress_this_period DECIMAL(5,2) GENERATED ALWAYS AS (
        current_progress_percent - previous_progress_percent
    ) STORED,
    
    -- Amounts
    previous_amount DECIMAL(15,2) DEFAULT 0,
    current_amount DECIMAL(15,2) DEFAULT 0,
    amount_this_period DECIMAL(15,2) GENERATED ALWAYS AS (
        current_amount - previous_amount
    ) STORED,
    
    -- Adjustments
    retention_percent DECIMAL(5,2) DEFAULT 10,
    retention_amount DECIMAL(15,2) DEFAULT 0,
    advance_recovery DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    
    -- Net Amount
    net_claim_amount DECIMAL(15,2) DEFAULT 0,
    vat_amount DECIMAL(15,2) DEFAULT 0,
    total_claim_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved, invoiced, paid
    submitted_date DATE,
    approved_date DATE,
    approved_by UUID REFERENCES users(id),
    
    -- Invoice Link
    invoice_id UUID REFERENCES invoices(id),
    
    notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, project_id, claim_number)
);

-- =============================================
-- TASKS & WORK MANAGEMENT MODULE
-- =============================================

CREATE TABLE task_boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    board_name VARCHAR(255) NOT NULL,
    board_name_ar VARCHAR(255),
    description TEXT,
    board_type VARCHAR(50) DEFAULT 'kanban', -- kanban, scrum
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, board_name)
);

CREATE TABLE task_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    board_id UUID REFERENCES task_boards(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    stage_name_ar VARCHAR(100),
    stage_order INTEGER NOT NULL,
    stage_color VARCHAR(7), -- Hex color
    is_closed_stage BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(board_id, stage_order)
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    task_number VARCHAR(50) NOT NULL,
    
    -- Task Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    
    -- Dates
    start_date DATE,
    due_date DATE,
    completed_date DATE,
    
    -- Classification
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, urgent
    task_type VARCHAR(50), -- task, bug, feature, support
    board_id UUID REFERENCES task_boards(id),
    stage_id UUID REFERENCES task_stages(id),
    
    -- Progress
    status VARCHAR(50) DEFAULT 'todo', -- todo, in_progress, review, done, cancelled
    progress_percent INTEGER DEFAULT 0,
    
    -- Time Tracking
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2) DEFAULT 0,
    
    -- Links
    parent_task_id UUID REFERENCES tasks(id),
    project_id UUID REFERENCES projects(id),
    customer_id UUID REFERENCES customers(id),
    
    -- Tags
    tags TEXT[], -- Array of tags
    
    -- Status
    is_billable BOOLEAN DEFAULT false,
    is_closed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tenant_id, task_number)
);

CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    comment_text TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_time_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    -- Time Tracking
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    hours DECIMAL(5,2),
    
    -- Description
    activity_description TEXT,
    
    -- Billing
    is_billable BOOLEAN DEFAULT false,
    billable_hours DECIMAL(5,2),
    hourly_rate DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SYSTEM & AUDIT TABLES
-- =============================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    -- Action
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    action VARCHAR(50) NOT NULL, -- create, update, delete, login, logout
    
    -- Details
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50), -- info, warning, error, success
    
    -- Action
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50), -- string, number, boolean, json
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, setting_key)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users & Auth
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee ON users(employee_id);

-- Employees
CREATE INDEX idx_employees_tenant ON employees(tenant_id);
CREATE INDEX idx_employees_number ON employees(employee_number);
CREATE INDEX idx_employees_branch ON employees(branch_id);
CREATE INDEX idx_employees_dept ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(employment_status);

-- Attendance
CREATE INDEX idx_attendance_emp_date ON attendance(employee_id, attendance_date);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

-- Payroll
CREATE INDEX idx_payroll_period ON payroll(period_id);
CREATE INDEX idx_payroll_employee ON payroll(employee_id);

-- Accounting
CREATE INDEX idx_journal_entries_tenant ON journal_entries(tenant_id);
CREATE INDEX idx_journal_entries_number ON journal_entries(entry_number);
CREATE INDEX idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);

CREATE INDEX idx_journal_lines_entry ON journal_entry_lines(journal_entry_id);
CREATE INDEX idx_journal_lines_account ON journal_entry_lines(account_id);

-- Invoices
CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_status ON invoices(status);

-- CRM
CREATE INDEX idx_leads_tenant ON crm_leads(tenant_id);
CREATE INDEX idx_leads_status ON crm_leads(status);
CREATE INDEX idx_leads_assigned ON crm_leads(assigned_to);

CREATE INDEX idx_opportunities_tenant ON crm_opportunities(tenant_id);
CREATE INDEX idx_opportunities_stage ON crm_opportunities(stage);
CREATE INDEX idx_opportunities_account ON crm_opportunities(account_id);

-- Projects
CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_projects_code ON projects(project_code);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);

-- Tasks
CREATE INDEX idx_tasks_tenant ON tasks(tenant_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Audit
CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_table ON audit_logs(table_name);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- =============================================
-- INITIAL DATA SEEDING
-- =============================================

-- Insert default tenant
INSERT INTO tenants (id, name, name_ar, domain, subscription_plan) 
VALUES 
('00000000-0000-0000-0000-000000000001', 'Demo Company', 'شركة تجريبية', 'demo.erp.local', 'enterprise');

-- Insert default roles
INSERT INTO roles (tenant_id, name, name_ar, is_system_role, permissions) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Admin', 'مدير النظام', true, '["all"]'::jsonb),
('00000000-0000-0000-0000-000000000001', 'HR Manager', 'مدير الموارد البشرية', true, '["hr.*"]'::jsonb),
('00000000-0000-0000-0000-000000000001', 'Accountant', 'محاسب', true, '["finance.*"]'::jsonb),
('00000000-0000-0000-0000-000000000001', 'Sales Manager', 'مدير المبيعات', true, '["crm.*"]'::jsonb),
('00000000-0000-0000-0000-000000000001', 'Project Manager', 'مدير المشاريع', true, '["projects.*"]'::jsonb),
('00000000-0000-0000-0000-000000000001', 'Employee', 'موظف', true, '["tasks.view", "tasks.create"]'::jsonb);

-- Insert default admin user (password: Admin@123)
INSERT INTO users (tenant_id, username, email, password_hash, role_id, full_name, full_name_ar, is_active)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'admin@demo.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lWLy8W8qPjKm', -- Admin@123
    id,
    'System Administrator',
    'مدير النظام',
    true
FROM roles 
WHERE tenant_id = '00000000-0000-0000-0000-000000000001' 
AND name = 'Super Admin';

-- Insert default leave types
INSERT INTO leave_types (tenant_id, code, name, name_ar, annual_entitlement, accrual_method, is_paid, requires_approval) VALUES
('00000000-0000-0000-0000-000000000001', 'ANNUAL', 'Annual Leave', 'إجازة سنوية', 30, 'yearly', true, true),
('00000000-0000-0000-0000-000000000001', 'SICK', 'Sick Leave', 'إجازة مرضية', 15, 'yearly', true, true),
('00000000-0000-0000-0000-000000000001', 'EMERGENCY', 'Emergency Leave', 'إجازة طارئة', 5, 'yearly', true, true),
('00000000-0000-0000-0000-000000000001', 'UNPAID', 'Unpaid Leave', 'إجازة بدون راتب', 0, 'none', false, true);

-- Insert default CRM sources
INSERT INTO crm_sources (tenant_id, name, name_ar) VALUES
('00000000-0000-0000-0000-000000000001', 'Website', 'الموقع الإلكتروني'),
('00000000-0000-0000-0000-000000000001', 'Referral', 'إحالة'),
('00000000-0000-0000-0000-000000000001', 'Cold Call', 'اتصال مباشر'),
('00000000-0000-0000-0000-000000000001', 'Social Media', 'وسائل التواصل'),
('00000000-0000-0000-0000-000000000001', 'Event', 'فعالية');

-- Insert default task board
INSERT INTO task_boards (tenant_id, board_name, board_name_ar, is_default) VALUES
('00000000-0000-0000-0000-000000000001', 'Main Board', 'اللوحة الرئيسية', true);

-- Insert default task stages
INSERT INTO task_stages (tenant_id, board_id, stage_name, stage_name_ar, stage_order, stage_color, is_closed_stage)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    id,
    stage,
    stage_ar,
    stage_order,
    color,
    is_closed
FROM task_boards,
LATERAL (VALUES 
    ('To Do', 'للإنجاز', 1, '#808080', false),
    ('In Progress', 'قيد التنفيذ', 2, '#3498db', false),
    ('Review', 'مراجعة', 3, '#f39c12', false),
    ('Done', 'منجز', 4, '#27ae60', true)
) AS stages(stage, stage_ar, stage_order, color, is_closed)
WHERE task_boards.tenant_id = '00000000-0000-0000-0000-000000000001'
AND task_boards.is_default = true;

COMMENT ON DATABASE postgres IS 'Enterprise ERP System - Multi-tenant Database';