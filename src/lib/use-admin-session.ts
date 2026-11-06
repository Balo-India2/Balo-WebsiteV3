import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** True while this tab has an admin session. Lost on a full refresh. */
export function useAdminSession() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSignedIn(Boolean(data.session));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return {
    signedIn,
    href: signedIn ? "/admin" : "/admin-login",
    label: signedIn ? "Admin" : "Admin login",
  };
}
