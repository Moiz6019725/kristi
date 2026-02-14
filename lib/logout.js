"use client"
export const logout = async () => {
    const res = await fetch('/api/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      window.location.href = '/login'; // Redirect to login after logout
    } else {
      console.error('Logout failed');
    }
  };