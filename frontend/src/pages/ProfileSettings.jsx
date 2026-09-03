import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, updateAvatar } from "../api/user.api.js";
import { resendEmailVerification, changePassword } from "../api/auth.api";

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [username, setUsername] = useState(user?.username || "");

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [avatarMessage, setAvatarMessage] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [resendingVerification, setResendingVerification] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const inputClass =
    "rounded-lg border border-black/10 dark:border-white/10 bg-bg-light dark:bg-bg-dark px-3 py-2.5 text-sm text-text-light dark:text-text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition";
const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;

  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  try {
    const apiOrigin = new URL(import.meta.env.VITE_API_URL).origin;
    return `${apiOrigin}${avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`}`;
  } catch {
    return avatarUrl;
  }
};
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileMessage("");
    setProfileError("");
    setSavingProfile(true);

    try {
      const res = await updateProfile({
        fullName,
        username,
      });

      await refreshUser();

      setFullName(res.data.data.fullName || "");
      setUsername(res.data.data.username || "");

      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileError(
        err?.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarMessage("");
    setAvatarError("");

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 1 * 1000 * 1000) {
      setAvatarError("Image must be smaller than 1 MB.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploadingAvatar(true);

    try {
      await updateAvatar(formData);

      await refreshUser();

      setAvatarMessage("Avatar updated successfully.");
    } catch (err) {
      setAvatarError(err?.response?.data?.message || "Failed to update avatar");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleResendVerification = async () => {
    setVerificationMessage("");
    setVerificationError("");
    setResendingVerification(true);

    try {
      const res = await resendEmailVerification();

      setVerificationMessage(res.data.message || "Verification email sent.");
    } catch (err) {
      setVerificationError(
        err?.response?.data?.message || "Failed to resend verification email",
      );
    } finally {
      setResendingVerification(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!oldPassword || !newPassword) {
      setPasswordError("Please fill in both password fields.");
      return;
    }

    setChangingPassword(true);

    try {
      const res = await changePassword({
        oldPassword,
        newPassword,
      });

      setOldPassword("");
      setNewPassword("");

      setPasswordMessage(res.data.message || "Password changed successfully.");
    } catch (err) {
      setPasswordError(
        err?.response?.data?.message || "Failed to change password",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-text-light dark:text-text-dark">
          Profile Settings
        </h1>

        <p className="text-muted text-sm mt-1">
          Manage your profile, email verification, and password.
        </p>
      </div>

      {/* Profile */}
      <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-black/10 dark:border-white/10 p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-6">
          Profile
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          {user?.avatar?.url ? (
            <img
              src={getAvatarUrl(user.avatar.url)}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-black/10 dark:border-white/10"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-bg-light dark:bg-bg-dark border border-black/10 dark:border-white/10 flex items-center justify-center text-text-light dark:text-text-dark">
              {user?.fullName?.charAt(0)?.toUpperCase() ||
                user?.username?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
          )}

          <div>
            <label className="inline-block cursor-pointer">
              <span className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition">
                {uploadingAvatar ? "Uploading…" : "Change avatar"}
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>

            <p className="text-xs text-muted mt-2">
              JPG, PNG, GIF or other image · Max 1 MB
            </p>
          </div>
        </div>

        {avatarMessage && (
          <p className="text-green-500 text-sm mb-4">{avatarMessage}</p>
        )}

        {avatarError && (
          <p className="text-red-500 text-sm mb-4">{avatarError}</p>
        )}

        {/* Profile form */}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Full name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`mt-1.5 w-full ${inputClass}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`mt-1.5 w-full ${inputClass}`}
            />
          </div>

          {profileMessage && (
            <p className="text-green-500 text-sm">{profileMessage}</p>
          )}

          {profileError && (
            <p className="text-red-500 text-sm">{profileError}</p>
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {savingProfile ? "Saving…" : "Save changes"}
          </button>
        </form>
      </section>

      {/* Email verification */}
      <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-black/10 dark:border-white/10 p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
          Email
        </h2>

        <p className="text-sm text-text-light dark:text-text-dark mb-2">
          {user?.email}
        </p>

        {user?.isEmailVerified ? (
          <p className="text-sm text-green-500">✓ Email verified</p>
        ) : (
          <div>
            <p className="text-sm text-red-500 mb-3">
              Email verification pending
            </p>

            <p className="text-sm text-muted mb-4">
              Your email address hasn't been verified yet. Check your inbox for
              the verification link.
            </p>

            {verificationMessage && (
              <p className="text-green-500 text-sm mb-3">
                {verificationMessage}
              </p>
            )}

            {verificationError && (
              <p className="text-red-500 text-sm mb-3">{verificationError}</p>
            )}

            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 text-sm font-medium text-text-light dark:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark disabled:opacity-60 transition"
            >
              {resendingVerification ? "Sending…" : "Resend verification email"}
            </button>
          </div>
        )}
      </section>

      {/* Password */}
      <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-black/10 dark:border-white/10 p-6">
        <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-6">
          Change password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Current password
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`mt-1.5 w-full ${inputClass}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              New password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`mt-1.5 w-full ${inputClass}`}
            />
          </div>

          {passwordMessage && (
            <p className="text-green-500 text-sm">{passwordMessage}</p>
          )}

          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}

          <button
            type="submit"
            disabled={changingPassword}
            className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {changingPassword ? "Changing…" : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
}
