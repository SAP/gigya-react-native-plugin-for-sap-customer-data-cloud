require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "gigya-react-native-plugin-for-sap-customer-data-cloud"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
  gigya-react-native-plugin-for-sap-customer-data-cloud
                   DESC
  s.homepage     = "https://github.com/SAP/gigya-react-native-plugin-for-sap-customer-data-cloud"
  s.license      = "Apache License 2.0"
  # s.license    = { :type => "Apache License 2.0", :file => "FILE_LICENSE" }
  s.authors      = { "Tal Mirmelshtein" => "tal.mirmelshtein@sap.com" , "Sagi Shmuel" => "sagi.shmuel@sap.com"}
  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/SAP/gigya-react-native-plugin-for-sap-customer-data-cloud.git", :tag => "#{s.version}" }
  s.swift_version = '5.1.3'
  s.source_files = "ios/*.{h,m,swift}", "ios/*/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency 'Gigya', '~> 1.4.0'
  
  # ...
  # s.dependency "..."
end

