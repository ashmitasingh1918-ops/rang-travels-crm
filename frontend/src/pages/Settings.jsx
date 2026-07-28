import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Building2,
  ChevronRight,
  Settings as SettingsIcon,
} from "lucide-react";
import "./Settings.css";
const Settings = () => {
  const navigate = useNavigate();

  const settings = [
    {
      title: "My Profile",
      description: "Update your personal information",
      icon: User,
      color: "#EEF4FF",
      iconColor: "#2563EB",
      path: "/settings/profile",
    },
    {
      title: "Security",
      description: "Password and account security",
      icon: Shield,
      color: "#ECFDF5",
      iconColor: "#16A34A",
      path: "/settings/security",
    },
    {
      title: "Company Details",
      description: "Company information and GST",
      icon: Building2,
      color: "#FFF8E7",
      iconColor: "#D97706",
      path: "/settings/company",
    },
  ];

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div
        className="p-4 rounded-4 mb-5"
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="d-flex align-items-center">

          <div
            className="me-3 d-flex align-items-center justify-content-center"
            style={{
              width: 65,
              height: 65,
              borderRadius: 18,
              background: "#EEF4FF",
            }}
          >
            <SettingsIcon color="#2563EB" size={30} />
          </div>

          <div>

            <h2 className="fw-bold mb-1">
              Settings
            </h2>

            <p className="text-muted mb-0">
              Manage your profile, security and company preferences.
            </p>

          </div>

        </div>
      </div>

      {/* Cards */}

      <div className="row g-4">

        {settings.map((item) => {

          const Icon = item.icon;

          return (

            <div
              className="col-lg-4 col-md-6"
              key={item.title}
            >

              <div
                className="card border-0 shadow-sm h-100 settings-card"
                onClick={() => navigate(item.path)}
                style={{
                  cursor: "pointer",
                  borderRadius: "22px",
                  transition: ".3s",
                }}
              >

                <div className="card-body p-4">

                  <div
                    className="d-flex align-items-center justify-content-center mb-4"
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 18,
                      background: item.color,
                    }}
                  >
                    <Icon
                      size={34}
                      color={item.iconColor}
                    />
                  </div>

                  <h4 className="fw-bold">
                    {item.title}
                  </h4>

                  <p
                    className="text-muted"
                    style={{
                      minHeight: 50,
                    }}
                  >
                    {item.description}
                  </p>

                  <div className="d-flex justify-content-end">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 42,
                        height: 42,
                        background: "#F3F4F6",
                      }}
                    >
                      <ChevronRight size={20} />
                    </div>

                  </div>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default Settings;