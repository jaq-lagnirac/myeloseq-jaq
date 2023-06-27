import fs from 'fs';

const readConfig = (packageJsonPath, configPath) => {
  const configFile = fs.readFileSync(new URL(configPath, import.meta.url));
  const packageJsonFile =
    fs.readFileSync(new URL(packageJsonPath, import.meta.url));
  const config = JSON.parse(configFile);
  config.package = JSON.parse(packageJsonFile);

  return config;
};

export default readConfig;