export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan_type: 'monthly' | 'lifetime' | 'free';
  api_credits: number;
  max_credits: number;
  created_at: string;
};

export type PhoneSearchRecord = {
  id: string;
  user_id: string;
  phone_number: string;
  carrier?: string;
  circle?: string;
  risk_score: number;
  status: 'Completed' | 'Processing' | 'Failed';
  telemetry_json?: Record<string, any>;
  created_at: string;
};

export type VehicleSearchRecord = {
  id: string;
  user_id: string;
  plate_number: string;
  make_model?: string;
  rto_location?: string;
  status: 'Completed' | 'Processing' | 'Failed';
  vehicle_json?: Record<string, any>;
  created_at: string;
};

export type InvestigationReport = {
  id: string;
  user_id: string;
  report_code: string;
  title: string;
  query_type: 'phone' | 'vehicle' | 'ai_case';
  summary?: string;
  confidence_score: number;
  created_at: string;
};
