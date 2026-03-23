import { useEffect, useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

const ROLE_OPTIONS = ['Mentor', 'Mentee', 'Collaborator'];
const SUGGESTED_SKILLS = ['React', 'Node.js', 'AI/ML', 'UI/UX', 'Product Design', 'Python', 'TypeScript', 'Next.js'];

function Profile() {
  const { api, user, setUser } = useAuth();
  const [form, setForm] = useState({ bio: '', location: 'Delhi/NCR', pincode: '', availability: 'Weekends only', skills: [], roles: [], photo: null });
  const [customSkill, setCustomSkill] = useState('');
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      bio: user.bio || '',
      location: user.location || 'Delhi/NCR',
      pincode: user.pincode || '',
      availability: user.availability || 'Weekends only',
      skills: user.skills || [],
      roles: user.roles || [],
      photo: null,
    });
    setPreview(user.photo?.startsWith('http') ? user.photo : user.photo ? `${import.meta.env.VITE_API_HOST || 'http://localhost:5000'}${user.photo}` : '');
  }, [user]);

  const canSubmit = useMemo(() => form.roles.length > 0 && form.skills.length > 0 && form.bio.trim() && form.availability.trim(), [form]);

  const toggleRole = (role) => setForm((prev) => ({ ...prev, roles: prev.roles.includes(role) ? prev.roles.filter((item) => item !== role) : [...prev.roles, role] }));
  const toggleSkill = (skill) => setForm((prev) => ({ ...prev, skills: prev.skills.includes(skill) ? prev.skills.filter((item) => item !== skill) : [...prev.skills, skill] }));

  const addCustomSkill = () => {
    const nextSkill = customSkill.trim();
    if (!nextSkill) return;
    if (!form.skills.includes(nextSkill)) setForm((prev) => ({ ...prev, skills: [...prev.skills, nextSkill] }));
    setCustomSkill('');
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = new FormData();
      payload.append('bio', form.bio.trim());
      payload.append('location', form.location.trim());
      payload.append('pincode', form.pincode.trim());
      payload.append('availability', form.availability.trim());
      payload.append('skills', form.skills.join(','));
      payload.append('roles', form.roles.join(','));
      if (form.photo) payload.append('photo', form.photo);
      const response = await api.put('/profile', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(response.data.user);
      setMessage(response.data.user.isProfileComplete ? 'Profile saved. You are ready to swipe.' : 'Profile saved. Add any missing fields to unlock swiping.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="profile-layout glass-panel page-shell floating-in">
      <aside className="profile-sidebar floating-in">
        <div className="avatar-frame">
          {preview ? <img src={preview} alt={user?.name} /> : <div className="avatar-placeholder">{user?.name?.charAt(0) || 'S'}</div>}
        </div>
        <h2 style={{ marginBottom: 4 }}>{user?.name}</h2>
        <p className="muted" style={{ marginTop: 0 }}>{user?.email}</p>
        <div className="inline-banner"><Icon name="spark" size={16} /> Complete your profile with a photo, bio, skills, roles, and availability before your swipe queue opens.</div>
        <div className="profile-side-list">
          <div className="side-chip"><Icon name="location" size={14} /> {form.location || 'Delhi/NCR'}</div>
          <div className="side-chip"><Icon name="briefcase" size={14} /> {(form.roles.length || 0)} role selections</div>
          <div className="side-chip"><Icon name="bolt" size={14} /> {form.availability || 'Add availability'}</div>
        </div>
      </aside>

      <div className="profile-editor floating-in">
        <div className="section-heading">
          <div>
            <div className="kicker"><Icon name="user" size={14} /> Profile completion</div>
            <h1 className="page-title">Make your first impression count</h1>
          </div>
          <span className="pill"><Icon name="spark" size={14} /> {form.bio.length}/200 bio chars</span>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="photo">Profile photo</label>
            <input id="photo" type="file" accept="image/*" onChange={handleFile} />
          </div>
          <div className="form-row">
            <label htmlFor="bio">Professional bio</label>
            <textarea id="bio" name="bio" maxLength="200" value={form.bio} onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))} placeholder="Product-minded frontend engineer mentoring early-career developers and open to weekend AI prototype builds." />
          </div>
          <div className="form-row">
            <label>Role focus</label>
            <div className="role-picker">
              {ROLE_OPTIONS.map((role) => <button type="button" className={`role-chip ${form.roles.includes(role) ? 'active' : ''}`} key={role} onClick={() => toggleRole(role)}>{role}</button>)}
            </div>
          </div>
          <div className="form-row">
            <label>Skills and tags</label>
            <div className="tag-cloud">
              {SUGGESTED_SKILLS.map((skill) => <button type="button" key={skill} className={`skill-tag ${form.skills.includes(skill) ? 'active' : ''}`} onClick={() => toggleSkill(skill)}>{skill}</button>)}
            </div>
            <div className="custom-skill-row">
              <input type="text" value={customSkill} onChange={(event) => setCustomSkill(event.target.value)} placeholder="Add a custom skill" />
              <button type="button" className="secondary-btn icon-btn" onClick={addCustomSkill}><Icon name="check" size={16} /> Add</button>
            </div>
          </div>
          <div className="double-grid">
            <div className="form-row"><label htmlFor="location">Location</label><input id="location" name="location" value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} /></div>
            <div className="form-row"><label htmlFor="pincode">Pincode</label><input id="pincode" name="pincode" value={form.pincode} onChange={(event) => setForm((prev) => ({ ...prev, pincode: event.target.value }))} /></div>
          </div>
          <div className="form-row">
            <label htmlFor="availability">Availability</label>
            <input id="availability" name="availability" value={form.availability} onChange={(event) => setForm((prev) => ({ ...prev, availability: event.target.value }))} placeholder="Weekends only / Full-time collab / Evenings" />
          </div>
          {message ? <div className="success-banner"><Icon name="check" size={16} /> {message}</div> : null}
          {error ? <div className="error-banner"><Icon name="x" size={16} /> {error}</div> : null}
          <button type="submit" className="primary-btn icon-btn" disabled={!canSubmit || saving}><Icon name="spark" size={18} /> {saving ? 'Saving profile...' : 'Save profile'}</button>
        </form>
      </div>
    </section>
  );
}

export default Profile;
