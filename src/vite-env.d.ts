/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_USE_MOCK_TOKEN?: string;
	readonly VITE_MOCK_EMPLOYEE_TYPE?: 'fulltime' | 'interns' | 'consultant';
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
