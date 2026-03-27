import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";

// Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18zQldWSkd3ajk3NUg2bTV6eVpBNlJsSEZOSkMiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3NzQ2NzYyOTIsImlhdCI6MTc3NDY0MDI5MiwiaXNzIjoiaHR0cHM6Ly9vbmUtaGFkZG9jay0xNC5jbGVyay5hY2NvdW50cy5kZXYiLCJqdGkiOiJmYmVhOGVjZGRlOWNkYzhjMjIzOCIsIm5iZiI6MTc3NDY0MDI4Nywic3ViIjoidXNlcl8zQlg0cEhIUHZSNEllYWh0cWUzc0RBZncwZjcifQ.B2INAjCBXIIBAet2cRsvfXZB2gM_yZwF1c6VKyPp6HoVETo8Dh0SiJYx7eroyUZc3-ewEM1xG69PRTxKIyWhgmM8H89jDIRDNgtmVQE2h7EYaim3EgbBYUfiLnCypXWPEWPD9Mb1WlurK41IrBCx9xLjOkAeLRsBCfJHHqSP-gBaR85DtbUHWIqSjN5rMJB6ARyDFieGATWaUr9cM63lLim2jC92xNCdaTfnHNimq64UdkG6WwDqePYouxNmPb8qOoqa211jRoBMfg2v_oPh2iziuEqqP5TZsieGY0ivm7NreDwF3FPD06il1LPFbs9yI-4kOleVcB3smsphCFqgIQ



export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();



  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return children;
}