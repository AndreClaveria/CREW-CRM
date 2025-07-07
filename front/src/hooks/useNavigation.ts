// src/hooks/useNavigation.ts
import { useRouter } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();

  const routes = {
    dashboard: "/dashboard",
    pipeline: {
      clients: "/dashboard/pipeline/clients",
      contacts: {
        list: "/dashboard/pipeline/contacts",
        add: "/dashboard/pipeline/contacts/add",
        edit: "/dashboard/pipeline/contacts/edit",
      },
      opportunities: "/dashboard/pipeline/opportunities",
      deals: "/dashboard/pipeline/deals",
    },
    team: {
      overview: "/dashboard/team",
      members: "/dashboard/team/members",
    },
    profile: "/dashboard/profile",
    settings: "/dashboard/settings",
    phone: {
      recentCalls: "/dashboard/phone/recent-calls",
      favorites: "/dashboard/phone/favorites",
      schedule: "/dashboard/phone/schedule",
    },
    email: {
      inbox: "/dashboard/mail/",
      sent: "/dashboard/mail/",
      drafts: "/dashboard/mail/",
    },
    calendar: {
      agenda: "/dashboard/calendar/agenda",
      appointments: "/dashboard/calendar/appointments",
      events: "/dashboard/calendar/events",
    },
    admin: {
      userManagement: "/dashboard/admin/user-management",
      systemSettings: "/dashboard/admin/system-settings",
      activityLogs: "/dashboard/admin/activity-logs",
      crmConfiguration: "/dashboard/admin/crm-configuration",
    },
    manager: {
      dashboard: "/dashboard/manager/dashboard",
      salesPerformance: "/dashboard/manager/sales-performance",
      salesAnalysis: "/dashboard/manager/sales-analysis",
      teamStats: "/dashboard/manager/team-stats",
    },
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navigateToPipeline = (section: keyof typeof routes.pipeline) => {
    if (section === "contacts") {
      router.push(routes.pipeline.contacts.list);
    } else {
      router.push(routes.pipeline[section]);
    }
  };

  const navigateToTeam = (section: keyof typeof routes.team) => {
    router.push(routes.team[section]);
  };

  const navigateToPhone = (section: keyof typeof routes.phone) => {
    router.push(routes.phone[section]);
  };

  const navigateToEmail = (section: keyof typeof routes.email) => {
    router.push(routes.email[section]);
  };

  const navigateToCalendar = (section: keyof typeof routes.calendar) => {
    router.push(routes.calendar[section]);
  };

  const navigateToAdmin = (section: keyof typeof routes.admin) => {
    router.push(routes.admin[section]);
  };

  const navigateToManager = (section: keyof typeof routes.manager) => {
    router.push(routes.manager[section]);
  };

  const navigateToContact = (
    action: "list" | "add" | "edit",
    id?: string,
    companyId?: string
  ) => {
    if (action === "edit" && id && companyId) {
      router.push(`${routes.pipeline.contacts.edit}/${companyId}/${id}`);
    } else if (action === "add" && companyId) {
      router.push(`${routes.pipeline.contacts.add}/${companyId}`);
    } else {
      router.push(routes.pipeline.contacts[action]);
    }
  };

  return {
    routes,
    navigateTo,
    navigateToPipeline,
    navigateToTeam,
    navigateToPhone,
    navigateToEmail,
    navigateToCalendar,
    navigateToAdmin,
    navigateToManager,
    navigateToContact,
  };
};
