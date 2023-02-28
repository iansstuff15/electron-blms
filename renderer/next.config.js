module.exports = {
  images: {
    loader: 'akamai',
    path: '',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {

        RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: "false",
      },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
      
    }

    return config;
  },
};

