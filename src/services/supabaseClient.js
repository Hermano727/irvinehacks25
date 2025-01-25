import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hwulpcnymufxdyzenzyu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dWxwY255bXVmeGR5emVuenl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NDU2OTMsImV4cCI6MjA1MzQyMTY5M30.x2etZl_Wjb-Ovf39Vm1liJSDiL_XXAFr8nCOyqxS3xU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
