
# InSpec Advanced Developer Course

## 1. About InSpec
- InSpec is an open-source, community-developed  compliance validation framework
- Provides a mechanism for defining machine-readable compliance and security requirements
- Easy to create, validate, and read content
- Cross-platform (Windows, Linux, Mac)
- Agnostic to other DevOps tools and techniques
- Integrates into multiple CM tools

### 1.1. Orchestration, Configuration Management, Validation to Deployment
InSpec operates with most orchestration and CM tools found in the DevOps pipeline implementations
![Alt text](../images/InSpec_Orchestration.png?raw=true "InSpec Orchestration")

---
### 1.2. Automating Security Validation Using InSpec
![Alt text](../images/Automating_Security_Validation.png?raw=true "Automating Security Validation")

---
### 1.3. Processing InSpec Results
![Alt text](../images/Processing_InSpec_Results.png?raw=true "Processing InSpec Results")

## 2. Course Overview
### 2.1. InSpec Profile Structure
```bash
$ tree nginx
      nginx
      └── profile
          ├── README.md
          ├── attributes.rb
          ├── controls
          │   ├── header_size.rb
          │   └──  ssl_certification.rb
          ├── inspec.yml
          └── libraries
              └── nginx_helper.rb
```
---
### 2.2. InSpec Controls Structure
```ruby
control "V-13727" do
  title "The worker_processes StartServers directive must be set properly."

  desc "These requirements are set to mitigate the effects of several types of
  denial of service attacks. Although there is some latitude concerning the
  settings themselves, the requirements attempt to provide reasonable limits
  for the protection of the web server. If necessary, these limits can be
  adjusted to accommodate the operational requirement of a given system."

  impact 0.5
  tag "severity": "medium"
  tag "gtitle": "WA000-WWA026"
  tag "gid": "V-13727"
  tag "rid": "SV-36645r2_rule"
  tag "stig_id": "WA000-WWA026 A22"
  tag "nist": ["CM-6", "Rev_4"]

  tag "check": "To view the worker_processes directive value enter the
  following command:
  grep ""worker_processes"" on the nginx.conf file and any separate included
  configuration files
  If the value of ""worker_processes"" is not set to auto or explicitly set,
  this is a finding:
  worker_processes   auto;
  worker_processes defines the number of worker processes. The optimal value
  depends on many factors including (but not limited to) the number of CPU
  cores, the number of hard disk drives that store data, and load pattern. When
  one is in doubt, setting it to the number of available CPU cores would be a
  good start (the value “auto” will try to autodetect it)."

  tag "fix": "Edit the configuration file and set the value of
  ""worker_processes"" to the value of auto or a value of 1 or higher:
  worker_processes auto;"

  describe nginx_conf(NGINX_CONF_FILE).params['worker_processes'] do
    it { should cmp [['auto']] }
  end
end
```

### 2.3. InSpec Results
#### 2.3.1. Failure
![Alt text](../images/InSpec_Failure.png?raw=true "InSpec Failure")

#### 2.3.2. Pass
![Alt text](../images/InSpec_Pass.png?raw=true "InSpec Pass")

#### 2.3.3. Multiple Controls
![Alt text](../images/InSpec_Multiple_Controls.png?raw=true "InSpec Multiple Controls")

### 2.4. Tooling and Reporting
![Alt text](../images/Tooling_Reporting.png?raw=true "Tooling Reporting")

### 2.5. InSpec Resources
PLACEHOLDER
![Alt text](../images/InSpec_Pass.png?raw=true "InSpec Resource example")


## 3. Recap of an InSpec profile
Let's start by creating a profile that will contain NGINX tests.

Start by moving to the /root directory.

```bash
$ cd ~
```

Next, create an InSpec profile named my_nginx.

```bash
inspec init profile my_nginx
```

The terminal output should look like the following:

```bash
$ inspec init profile my_nginx
Create new profile at /root/my_nginx
 * Create directory controls
 * Create file controls/example.rb
 * Create file inspec.yml
 * Create directory libraries
 * Create file README.md
```



### 3.1. Understanding the profile structure

Let's take a look at how the profile is structured. We'll start with how a profile's files are structured and then move to what makes up an InSpec control.

First, run `tree` to see what's in the `my_nginx` profile.

```bash
$ tree my_nginx
      my_nginx
      ├── README.md
      ├── controls
      │   └── example.rb
      ├── inspec.yml
      └── libraries

      2 directories, 3 files
```

Here's the role of each component.

* `README.md` provides documentation about the profile, including what it covers and how to run it.
* The `controls` directory contains files which implement the InSpec tests.
* `inspec.yml` provides metadata, or information, about the profile. Metadata includes the profile's description, author, copyright, and version.
* The `libraries` directory contains resource extensions. A resource extension enables you to [define your own resource types](https://www.inspec.io/docs/reference/dsl_resource/). You won't work with resource extensions in this module.



### 3.2. Understand a control's structure

Let's take a look at the default control file, `controls/example.rb`.

```ruby
title 'sample section'

# you can also use plain tests
describe file('/tmp') do
  it { should be_directory }
end

# you add controls here
control 'tmp-1.0' do                        # A unique ID for this control
  impact 0.7                                # The criticality, if this control fails.
  title 'Create /tmp directory'             # A human-readable title
  desc 'An optional description...'
  describe file('/tmp') do                  # The actual test
    it { should be_directory }
  end
end
```
::: tip Tip for developing profiles
When creating new profiles use the existing example file as a template
:::

This example shows two tests. Both tests check for the existence of the `/tmp` directory. The second test provides additional information about the test. Let's break down each component.

* `control` (line 12) is followed by the control's name. Each control in a profile has a unique name.
* `impact` (line 13) measures the relative importance of the test and must be a value between 0.0 and 1.0.
* `title` (line 14) defines the control's purpose.
* `desc` (line 15) provides a more complete description of what the control checks for.
* `describe` (lines 16 — 18) defines the test. Here, the test checks for the existence of the `/tmp` directory.

In Ruby, the `do` and `end` keywords define a `block`. An InSpec control always contains at least one `describe` block. However, a control can contain many `describe` blocks.
::: tip More information on a block
[block](http://ruby-for-beginners.rubymonstas.org/blocks.html)
:::


### 3.3. Understand a describe block's structure

As with many test frameworks, InSpec code resembles natural language. Here's the format of a describe block.

```ruby
describe <entity> do
  it { <expectation> }
end
```

An InSpec test has two main components: the subject to examine and the subject's expected state. Here, `<entity>` is the subject you want to examine, for example, a package name, service, file, or network port. The `<expectation>` part specifies the desired result or expected state, for example, that a port should be open (or perhaps should not be open.)

Let's take a closer look at the `describe` block in the example.

```ruby
describe file('/tmp') do
  it { should be_directory }
end
```

Because InSpec resembles human-readable language, you might read this test as "/tmp should be a directory." Let's break down each component.

---
#### 3.3.1. file

[file](https://www.inspec.io/docs/reference/resources/file/) is an InSpec [resource](https://www.inspec.io/docs/reference/resources/). If you're familiar with Chef, you know that a resource configures one part of the system. InSpec resources are similar. For example, the InSpec file resource tests for file attributes, including a file's owner, mode, and permissions. The example examines the /tmp directory.

---
#### 3.3.2. it

The `it` statement validates one of your resource's features. A `describe` block contains one or more `it` statements. `it` enables you to test the resource itself. You'll also see `its`, which describes some feature of the resource, such as its mode or owner. You'll see examples of both `it` and `its` shortly.

---
#### 3.3.3. should

`should` describes the expectation. `should` asserts that the condition that follows _should_ be true. Alternatively, `should_not` asserts that the condition that follows _should not_ be true. You'll see examples of both shortly.

---
#### 3.3.4. be_directory

`be_directory` is an example of a [matcher](https://www.inspec.io/docs/reference/matchers/). A matcher compares a resource's actual value to its expected value. InSpec provides several predefined matchers. The `file` resource provides the `be_directory` matcher.



## 4. Advanced techniques in profile development
### 4.1. rspec Explicit Subject
Here we have a inspec test that lists out it's current directory. Our original test code looks like this
```ruby
describe command('ls -al').stdout.strip do
  it { should_not be_empty }
end
```

If we would like to have a more [Explicit Subject](https://relishapp.com/rspec/rspec-core/docs/subject/explicit-subject) then we could refactor the code like this example
```ruby
describe "this is a detailed message" do
  subject { command('ls -al').stdout.strip }
  it{ should_not be_empty }
end
```

### 4.2. looping file structure
For looping through a file directory, the directory resource is not powerful enough to do that, so we are required to use the `command` resource and run a `find` or it's equivalent for your target OS. This can be very resource intensive on your target so try to be as specific as possible with your search such as the example below:
```ruby
command('find ~/* -type f -maxdepth 0 -xdev').stdout.split.each do |fname|
  describe file(fname) do
    its('owner') { should cmp 'ec2-user' }
  end
end
```

### 4.3. Checking password encryption
Here we have an inspec test that checks if passwords are SHA512 hashes. As a quick thought exercise can you think of how we can adjust the control below to support SHA512 or higher assuming where you are testing uses SHA1024 or even SHA2048?

```ruby
bad_users = inspec.shadow.where { password != "*" && password != "!" && password !~ /\$6\$/ }.users

describe 'Password hashes in /etc/shadow' do
  it 'should only contain SHA512 hashes' do
    failure_message = "Users without SHA512 hashes: #{bad_users.join(', ')}"
    expect(bad_users).to be_empty, failure_message
  end
end
```

## 5. Exploring InSpec Resources

Before we dive into the course we want to take a look into what is a resource.

When writing InSpec code, many resources are available to you.

* You can [explore the InSpec resources](https://www.inspec.io/docs/reference/resources/) to see which resources are available.
* You can [examine the source code](https://github.com/inspec/inspec/tree/master/lib/inspec/resources) to see what's available. For example, you can see how file and other InSpec resources are implemented.

There's also [Resource DSL](https://www.inspec.io/docs/reference/dsl_resource/), which gives a brief overview of how to write your own resource.



### 5.1. Resource Overview

Resources may be added to profiles in the libraries folder:
```bash
$ tree examples/profile
examples/profile
...
├── libraries
│   └── gordon_config.rb
```


### 5.2. Resource Structure
The smallest possible resource takes this form:

```ruby
class Tiny < Inspec.resource(1)
  name 'tiny'
end
```

Resources are written as a regular Ruby class which inherits from Inspec.resource. The number (1) specifies the version this resource plugin targets. As Chef InSpec evolves, this interface may change and may require a higher version.

The following attributes can be configured:

name - Identifier of the resource (required)
desc - Description of the resource (optional)
example - Example usage of the resource (optional)
supports - (Chef InSpec 2.0+) Platform restrictions of the resource (optional)
The following methods are available to the resource:

inspec - Contains a registry of all other resources to interact with the operating system or target in general.
skip_resource - A resource may call this method to indicate that requirements aren’t met. All tests that use this resource will be marked as skipped.

The following example shows a full resource using attributes and methods to provide simple access to a configuration file:
```ruby
class GordonConfig < Inspec.resource(1)
  name 'gordon_config'

  # Restrict to only run on the below platforms (if none were given, all OS's supported)
  supports platform_family: 'fedora'
  supports platform: 'centos', release: '6.9'
  # Supports `*` for wildcard matcher in the release
  supports platform: 'centos', release: '7.*'

  desc '
    Resource description ...
  '

  example '
    describe gordon_config do
      its("signal") { should eq "on" }
    end
  '

  # Load the configuration file on initialization
  def initialize(path = nil)
    @path = path || '/etc/gordon.conf'
    @params = SimpleConfig.new( read_content )
  end

  # Expose all parameters of the configuration file.
  def method_missing(name)
    @params[name]
  end

  private

  def read_content
    f = inspec.file(@path)
    # Test if the path exist and that it's a file
    if f.file?
      # Retrieve the file's contents
      f.content
    else
      # If the file doesn't exist, skip all tests that use gordon_config
      raise Inspec::Exceptions::ResourceSkipped, "Can't read config at #{@path}"
    end
  end
end
```

## 6. Explore the basics of a resource
### 6.1. class
### 6.2. name
### 6.3. supports
### 6.4. desc & examples
### 6.5. initialize method
### 6.6. functionality methods


## 7. Local Resource vs Builtin Resource
### 7.1. Local Resource
### 7.2. Builtin InSpec Resource


## 8. Dissecting Resources
### 8.1. NGINX
```ruby
require "pathname"
require "hashie/mash"
require "inspec/resources/command"

module Inspec::Resources
  class Nginx < Inspec.resource(1)
    name "nginx"
    supports platform: "unix"
    desc "Use the nginx InSpec audit resource to test information about your NGINX instance."
    example <<~EXAMPLE
      describe nginx do
        its('conf_path') { should cmp '/etc/nginx/nginx.conf' }
      end
      describe nginx('/etc/sbin/') do
        its('version') { should be >= '1.0.0' }
      end
      describe nginx do
        its('modules') { should include 'my_module' }
      end
    EXAMPLE
    attr_reader :params, :bin_dir

    def initialize(nginx_path = "/usr/sbin/nginx")
      return skip_resource "The `nginx` resource is not yet available on your OS." if inspec.os.windows?
      return skip_resource "The `nginx` binary not found in the path provided." unless inspec.command(nginx_path).exist?

      cmd = inspec.command("#{nginx_path} -V 2>&1")
      if cmd.exit_status != 0
        return skip_resource "Error using the command nginx -V"
      end

      @data = cmd.stdout
      @params = {}
      read_content
    end

    %w{error_log_path http_client_body_temp_path http_fastcgi_temp_path http_log_path http_proxy_temp_path http_scgi_temp_path http_uwsgi_temp_path lock_path modules_path prefix sbin_path service version}.each do |property|
      define_method(property.to_sym) do
        @params[property.to_sym]
      end
    end

    def openssl_version
      result = @data.scan(/built with OpenSSL\s(\S+)\s(\d+\s\S+\s\d{4})/).flatten
      Hashie::Mash.new({ "version" => result[0], "date" => result[1] })
    end

    def compiler_info
      result = @data.scan(/built by (\S+)\s(\S+)\s(\S+)/).flatten
      Hashie::Mash.new({ "compiler" => result[0], "version" => result[1], "date" => result[2] })
    end

    def support_info
      support_info = @data.scan(/(.*\S+) support enabled/).flatten
      support_info.empty? ? nil : support_info.join(" ")
    end

    def modules
      @data.scan(/--with-(\S+)_module/).flatten
    end

    def to_s
      "Nginx Environment"
    end

    private

    def read_content
      parse_config
      parse_path
      parse_http_path
    end

    def parse_config
      @params[:prefix] = @data.scan(/--prefix=(\S+)\s/).flatten.first
      @params[:service] = "nginx"
      @params[:version] = @data.scan(%r{nginx version: nginx\/(\S+)\s}).flatten.first
    end

    def parse_path
      @params[:sbin_path] = @data.scan(/--sbin-path=(\S+)\s/).flatten.first
      @params[:modules_path] = @data.scan(/--modules-path=(\S+)\s/).flatten.first
      @params[:error_log_path] = @data.scan(/--error-log-path=(\S+)\s/).flatten.first
      @params[:http_log_path] = @data.scan(/--http-log-path=(\S+)\s/).flatten.first
      @params[:lock_path] = @data.scan(/--lock-path=(\S+)\s/).flatten.first
    end

    def parse_http_path
      @params[:http_client_body_temp_path] = @data.scan(/--http-client-body-temp-path=(\S+)\s/).flatten.first
      @params[:http_proxy_temp_path] = @data.scan(/--http-proxy-temp-path=(\S+)\s/).flatten.first
      @params[:http_fastcgi_temp_path] = @data.scan(/--http-fastcgi-temp-path=(\S+)\s/).flatten.first
      @params[:http_uwsgi_temp_path] = @data.scan(/--http-uwsgi-temp-path=(\S+)\s/).flatten.first
      @params[:http_scgi_temp_path] = @data.scan(/--http-scgi-temp-path=(\S+)\s/).flatten.first
    end
  end
end
```
### 8.2. File
```ruby
# copyright: 2015, Vulcano Security GmbH

require "shellwords"
require "inspec/utils/parser"

module Inspec::Resources
  module FilePermissionsSelector
    def select_file_perms_style(os)
      if os.unix?
        UnixFilePermissions.new(inspec)
      elsif os.windows?
        WindowsFilePermissions.new(inspec)
      end
    end
  end

  # TODO: rename file_resource.rb
  class FileResource < Inspec.resource(1)
    include FilePermissionsSelector
    include LinuxMountParser

    name "file"
    supports platform: "unix"
    supports platform: "windows"
    desc "Use the file InSpec audit resource to test all system file types, including files, directories, symbolic links, named pipes, sockets, character devices, block devices, and doors."
    example <<~EXAMPLE
      describe file('path') do
        it { should exist }
        it { should be_file }
        it { should be_readable }
        it { should be_writable }
        it { should be_executable.by_user('root') }
        it { should be_owned_by 'root' }
        its('mode') { should cmp '0644' }
      end
    EXAMPLE

    attr_reader :file, :mount_options
    def initialize(path)
      # select permissions style
      @perms_provider = select_file_perms_style(inspec.os)
      @file = inspec.backend.file(path)
    end

    %w{
      type exist? file? block_device? character_device? socket? directory?
      symlink? pipe? mode mode? owner owned_by? group grouped_into?
      link_path shallow_link_path linked_to? mtime size selinux_label immutable?
      product_version file_version version? md5sum sha256sum
      path basename source source_path uid gid
    }.each do |m|
      define_method m do |*args|
        file.send(m, *args)
      end
    end

    def content
      res = file.content
      return nil if res.nil?

      res.force_encoding("utf-8")
    end

    def contain(*_)
      raise "Contain is not supported. Please use standard RSpec matchers."
    end

    def readable?(by_usergroup, by_specific_user)
      return false unless exist?
      return skip_resource "`readable?` is not supported on your OS yet." if @perms_provider.nil?

      file_permission_granted?("read", by_usergroup, by_specific_user)
    end

    def writable?(by_usergroup, by_specific_user)
      return false unless exist?
      return skip_resource "`writable?` is not supported on your OS yet." if @perms_provider.nil?

      file_permission_granted?("write", by_usergroup, by_specific_user)
    end

    def executable?(by_usergroup, by_specific_user)
      return false unless exist?
      return skip_resource "`executable?` is not supported on your OS yet." if @perms_provider.nil?

      file_permission_granted?("execute", by_usergroup, by_specific_user)
    end

    def allowed?(permission, opts = {})
      return false unless exist?
      return skip_resource "`allowed?` is not supported on your OS yet." if @perms_provider.nil?

      file_permission_granted?(permission, opts[:by], opts[:by_user])
    end

    def mounted?(expected_options = nil, identical = false)
      mounted = file.mounted

      # return if no additional parameters have been provided
      return file.mounted? if expected_options.nil?

      # deprecation warning, this functionality will be removed in future version
      Inspec.deprecate(:file_resource_be_mounted_matchers, "The file resource `be_mounted.with` and `be_mounted.only_with` matchers are deprecated. Please use the `mount` resource instead")

      # we cannot read mount data on non-Linux systems
      return nil unless inspec.os.linux?

      # parse content if we are on linux
      @mount_options ||= parse_mount_options(mounted.stdout, true)

      if identical
        # check if the options should be identical
        @mount_options == expected_options
      else
        # otherwise compare the selected values
        @mount_options.contains(expected_options)
      end
    end

    def suid
      (mode & 04000) > 0
    end

    alias setuid? suid

    def sgid
      (mode & 02000) > 0
    end

    alias setgid? sgid

    def sticky
      (mode & 01000) > 0
    end

    alias sticky? sticky

    def more_permissive_than?(max_mode = nil)
      raise Inspec::Exceptions::ResourceFailed, "The file" + file.path + "doesn't seem to exist" unless exist?
      raise ArgumentError, "You must proivde a value for the `maximum allowable permission` for the file." if max_mode.nil?
      raise ArgumentError, "You must proivde the `maximum permission target` as a `String`, you provided: " + max_mode.class.to_s unless max_mode.is_a?(String)
      raise ArgumentError, "The value of the `maximum permission target` should be a valid file mode in 4-ditgit octal format: for example, `0644` or `0777`" unless /(0)?([0-7])([0-7])([0-7])/.match?(max_mode)

      # Using the files mode and a few bit-wise calculations we can ensure a
      # file is no more permisive than desired.
      #
      # 1. Calculate the inverse of the desired mode (e.g., 0644) by XOR it with
      # 0777 (all 1s). We are interested in the bits that are currently 0 since
      # it indicates that the actual mode is more permissive than the desired mode.
      # Conversely, we dont care about the bits that are currently 1 because they
      # cannot be any more permissive and we can safely ignore them.
      #
      # 2. Calculate the above result of ANDing the actual mode and the inverse
      # mode. This will determine if any of the bits that would indicate a more
      # permissive mode are set in the actual mode.
      #
      # 3. If the result is 0000, the files mode is equal
      # to or less permissive than the desired mode (PASS). Otherwise, the files
      # mode is more permissive than the desired mode (FAIL).

      max_mode = max_mode.to_i(8)
      inv_mode = 0777 ^ max_mode

      inv_mode & file.mode != 0
    end

    def to_s
      "File #{source_path}"
    end

    private

    def file_permission_granted?(access_type, by_usergroup, by_specific_user)
      raise "`file_permission_granted?` is not supported on your OS" if @perms_provider.nil?

      if by_specific_user.nil? || by_specific_user.empty?
        @perms_provider.check_file_permission_by_mask(file, access_type, by_usergroup, by_specific_user)
      else
        @perms_provider.check_file_permission_by_user(access_type, by_specific_user, source_path)
      end
    end
  end

  class FilePermissions
    attr_reader :inspec
    def initialize(inspec)
      @inspec = inspec
    end
  end

  class UnixFilePermissions < FilePermissions
    def permission_flag(access_type)
      case access_type
      when "read"
        "r"
      when "write"
        "w"
      when "execute"
        "x"
      else
        raise "Invalid access_type provided"
      end
    end

    def usergroup_for(usergroup, specific_user)
      if usergroup == "others"
        "other"
      elsif (usergroup.nil? || usergroup.empty?) && specific_user.nil?
        "all"
      else
        usergroup
      end
    end

    def check_file_permission_by_mask(file, access_type, usergroup, specific_user)
      usergroup = usergroup_for(usergroup, specific_user)
      flag = permission_flag(access_type)
      mask = file.unix_mode_mask(usergroup, flag)
      raise "Invalid usergroup/owner provided" if mask.nil?

      (file.mode & mask) != 0
    end

    def check_file_permission_by_user(access_type, user, path)
      flag = permission_flag(access_type)
      if inspec.os.linux?
        perm_cmd = "su -s /bin/sh -c \"test -#{flag} #{path}\" #{user}"
      elsif inspec.os.bsd? || inspec.os.solaris?
        perm_cmd = "sudo -u #{user} test -#{flag} #{path}"
      elsif inspec.os.aix?
        perm_cmd = "su #{user} -c test -#{flag} #{path}"
      elsif inspec.os.hpux?
        perm_cmd = "su #{user} -c \"test -#{flag} #{path}\""
      else
        return skip_resource "The `file` resource does not support `by_user` on your OS."
      end

      cmd = inspec.command(perm_cmd)
      cmd.exit_status == 0 ? true : false
    end
  end

  class WindowsFilePermissions < FilePermissions
    def check_file_permission_by_mask(_file, _access_type, _usergroup, _specific_user)
      raise "`check_file_permission_by_mask` is not supported on Windows"
    end

    def more_permissive_than?(*)
      raise Inspec::Exceptions::ResourceSkipped, "The `more_permissive_than?` matcher is not supported on your OS yet."
    end

    def check_file_permission_by_user(access_type, user, path)
      access_rule = translate_perm_names(access_type)
      access_rule = convert_to_powershell_array(access_rule)

      cmd = inspec.command("@(@((Get-Acl '#{path}').access | Where-Object {$_.AccessControlType -eq 'Allow' -and $_.IdentityReference -eq '#{user}' }) | Where-Object {($_.FileSystemRights.ToString().Split(',') | % {$_.trim()} | ? {#{access_rule} -contains $_}) -ne $null}) | measure | % { $_.Count }")
      cmd.stdout.chomp == "0" ? false : true
    end

    private

    def convert_to_powershell_array(arr)
      if arr.empty?
        "@()"
      else
        %{@('#{arr.join("', '")}')}
      end
    end

    # Translates a developer-friendly string into a list of acceptable
    # FileSystemRights that match it, because Windows has a fun heirarchy
    # of permissions that are able to be noted in multiple ways.
    #
    # See also: https://www.codeproject.com/Reference/871338/AccessControl-FileSystemRights-Permissions-Table
    def translate_perm_names(access_type)
      names = translate_common_perms(access_type)
      names ||= translate_granular_perms(access_type)
      names ||= translate_uncommon_perms(access_type)
      raise "Invalid access_type provided" unless names

      names
    end

    def translate_common_perms(access_type)
      case access_type
      when "full-control"
        %w{FullControl}
      when "modify"
        translate_perm_names("full-control") + %w{Modify}
      when "read"
        translate_perm_names("modify") + %w{ReadAndExecute Read}
      when "write"
        translate_perm_names("modify") + %w{Write}
      when "execute"
        translate_perm_names("modify") + %w{ReadAndExecute ExecuteFile Traverse}
      when "delete"
        translate_perm_names("modify") + %w{Delete}
      end
    end

    def translate_uncommon_perms(access_type)
      case access_type
      when "delete-subdirectories-and-files"
        translate_perm_names("full-control") + %w{DeleteSubdirectoriesAndFiles}
      when "change-permissions"
        translate_perm_names("full-control") + %w{ChangePermissions}
      when "take-ownership"
        translate_perm_names("full-control") + %w{TakeOwnership}
      when "synchronize"
        translate_perm_names("full-control") + %w{Synchronize}
      end
    end

    def translate_granular_perms(access_type)
      case access_type
      when "write-data", "create-files"
        translate_perm_names("write") + %w{WriteData CreateFiles}
      when "append-data", "create-directories"
        translate_perm_names("write") + %w{CreateDirectories AppendData}
      when "write-extended-attributes"
        translate_perm_names("write") + %w{WriteExtendedAttributes}
      when "write-attributes"
        translate_perm_names("write") + %w{WriteAttributes}
      when "read-data", "list-directory"
        translate_perm_names("read") + %w{ReadData ListDirectory}
      when "read-attributes"
        translate_perm_names("read") + %w{ReadAttributes}
      when "read-extended-attributes"
        translate_perm_names("read") + %w{ReadExtendedAttributes}
      when "read-permissions"
        translate_perm_names("read") + %w{ReadPermissions}
      end
    end
  end
end
```
### 8.3. Directory
```ruby
require "inspec/resources/file"

module Inspec::Resources
  class Directory < FileResource
    name "directory"
    supports platform: "unix"
    supports platform: "windows"
    desc "Use the directory InSpec audit resource to test if the file type is a directory. This is equivalent to using the file InSpec audit resource and the be_directory matcher, but provides a simpler and more direct way to test directories. All of the matchers available to file may be used with directory."
    example <<~EXAMPLE
      describe directory('path') do
        it { should be_directory }
      end
    EXAMPLE

    def exist?
      file.exist? && file.directory?
    end

    def to_s
      "Directory #{source_path}"
    end
  end
end
```
### 8.4. command
```ruby
# copyright: 2015, Vulcano Security GmbH

require "inspec/resource"

module Inspec::Resources
  class Cmd < Inspec.resource(1)
    name "command"
    supports platform: "unix"
    supports platform: "windows"
    desc "Use the command InSpec audit resource to test an arbitrary command that is run on the system."
    example <<~EXAMPLE
      describe command('ls -al /') do
        its('stdout') { should match /bin/ }
        its('stderr') { should eq '' }
        its('exit_status') { should eq 0 }
      end

      command('ls -al /').exist? will return false. Existence of command should be checked this way.
      describe command('ls') do
        it { should exist }
      end
    EXAMPLE

    attr_reader :command

    def initialize(cmd, options = {})
      if cmd.nil?
        raise "InSpec `command` was called with `nil` as the argument. This is not supported. Please provide a valid command instead."
      end

      @command = cmd

      if options[:redact_regex]
        unless options[:redact_regex].is_a?(Regexp)
          # Make sure command is replaced so sensitive output isn't shown
          @command = "ERROR"
          raise Inspec::Exceptions::ResourceFailed,
            "The `redact_regex` option must be a regular expression"
        end
        @redact_regex = options[:redact_regex]
      end
    end

    def result
      @result ||= inspec.backend.run_command(@command)
    end

    def stdout
      result.stdout
    end

    def stderr
      result.stderr
    end

    def exit_status
      result.exit_status.to_i
    end

    def exist? # rubocop:disable Metrics/AbcSize
      # silent for mock resources
      return false if inspec.os.name.nil? || inspec.os.name == "mock"

      if inspec.os.linux?
        res = if inspec.platform.name == "alpine"
                inspec.backend.run_command("which \"#{@command}\"")
              else
                inspec.backend.run_command("bash -c 'type \"#{@command}\"'")
              end
      elsif inspec.os.windows?
        res = inspec.backend.run_command("Get-Command \"#{@command}\"")
      elsif inspec.os.unix?
        res = inspec.backend.run_command("type \"#{@command}\"")
      else
        warn "`command(#{@command}).exist?` is not supported on your OS: #{inspec.os[:name]}"
        return false
      end
      res.exit_status.to_i == 0
    end

    def to_s
      output = "Command: `#{@command}`"
      # Redact output if the `redact_regex` option is passed
      # If no capture groups are passed then `\1` and `\2` are ignored
      output.gsub!(@redact_regex, '\1REDACTED\2') unless @redact_regex.nil?
      output
    end
  end
end
```
### 8.5. Docker
```ruby
#
# Copyright 2017, Christoph Hartmann
#

require "inspec/resources/command"
require "inspec/utils/filter"
require "hashie/mash"

module Inspec::Resources
  class DockerContainerFilter
    # use filtertable for containers
    filter = FilterTable.create
    filter.register_custom_matcher(:exists?) { |x| !x.entries.empty? }
    filter.register_column(:commands, field: "command")
      .register_column(:ids,            field: "id")
      .register_column(:images,         field: "image")
      .register_column(:labels,         field: "labels", style: :simple)
      .register_column(:local_volumes,  field: "localvolumes")
      .register_column(:mounts,         field: "mounts")
      .register_column(:names,          field: "names")
      .register_column(:networks,       field: "networks")
      .register_column(:ports,          field: "ports")
      .register_column(:running_for,    field: "runningfor")
      .register_column(:sizes,          field: "size")
      .register_column(:status,         field: "status")
      .register_custom_matcher(:running?) do |x|
        x.where { status.downcase.start_with?("up") }
      end
    filter.install_filter_methods_on_resource(self, :containers)

    attr_reader :containers
    def initialize(containers)
      @containers = containers
    end
  end

  class DockerImageFilter
    filter = FilterTable.create
    filter.register_custom_matcher(:exists?) { |x| !x.entries.empty? }
    filter.register_column(:ids, field: "id")
      .register_column(:repositories,  field: "repository")
      .register_column(:tags,          field: "tag")
      .register_column(:sizes,         field: "size")
      .register_column(:digests,       field: "digest")
      .register_column(:created,       field: "createdat")
      .register_column(:created_since, field: "createdsize")
    filter.install_filter_methods_on_resource(self, :images)

    attr_reader :images
    def initialize(images)
      @images = images
    end
  end

  class DockerPluginFilter
    filter = FilterTable.create
    filter.add(:ids, field: "id")
      .add(:names,    field: "name")
      .add(:versions, field: "version")
      .add(:enabled,  field: "enabled")
    filter.connect(self, :plugins)

    attr_reader :plugins
    def initialize(plugins)
      @plugins = plugins
    end
  end

  class DockerServiceFilter
    filter = FilterTable.create
    filter.register_custom_matcher(:exists?) { |x| !x.entries.empty? }
    filter.register_column(:ids, field: "id")
      .register_column(:names,    field: "name")
      .register_column(:modes,    field: "mode")
      .register_column(:replicas, field: "replicas")
      .register_column(:images,   field: "image")
      .register_column(:ports,    field: "ports")
    filter.install_filter_methods_on_resource(self, :services)

    attr_reader :services
    def initialize(services)
      @services = services
    end
  end

  # This resource helps to parse information from the docker host
  # For compatability with Serverspec we also offer the following resouses:
  # - docker_container
  # - docker_image
  class Docker < Inspec.resource(1)
    name "docker"
    supports platform: "unix"
    desc "
      A resource to retrieve information about docker
    "

    example <<~EXAMPLE
      describe docker.containers do
        its('images') { should_not include 'u12:latest' }
      end

      describe docker.images do
        its('repositories') { should_not include 'inssecure_image' }
      end

      describe docker.plugins.where { name == 'rexray/ebs' } do
        it { should exist }
      end

      describe docker.services do
        its('images') { should_not include 'inssecure_image' }
      end

      describe docker.version do
        its('Server.Version') { should cmp >= '1.12'}
        its('Client.Version') { should cmp >= '1.12'}
      end

      describe docker.object(id) do
        its('Configuration.Path') { should eq 'value' }
      end

      docker.containers.ids.each do |id|
        # call docker inspect for a specific container id
        describe docker.object(id) do
          its(%w(HostConfig Privileged)) { should cmp false }
          its(%w(HostConfig Privileged)) { should_not cmp true }
        end
      end
    EXAMPLE

    def containers
      DockerContainerFilter.new(parse_containers)
    end

    def images
      DockerImageFilter.new(parse_images)
    end

    def plugins
      DockerPluginFilter.new(parse_plugins)
    end

    def services
      DockerServiceFilter.new(parse_services)
    end

    def version
      return @version if defined?(@version)

      data = {}
      cmd = inspec.command("docker version --format '{{ json . }}'")
      data = JSON.parse(cmd.stdout) if cmd.exit_status == 0
      @version = Hashie::Mash.new(data)
    rescue JSON::ParserError => _e
      Hashie::Mash.new({})
    end

    def info
      return @info if defined?(@info)

      data = {}
      # docke info format is only supported for Docker 17.03+
      cmd = inspec.command("docker info --format '{{ json . }}'")
      data = JSON.parse(cmd.stdout) if cmd.exit_status == 0
      @info = Hashie::Mash.new(data)
    rescue JSON::ParserError => _e
      Hashie::Mash.new({})
    end

    # returns information about docker objects
    def object(id)
      return @inspect if defined?(@inspect)

      data = JSON.parse(inspec.command("docker inspect #{id}").stdout)
      data = data[0] if data.is_a?(Array)
      @inspect = Hashie::Mash.new(data)
    rescue JSON::ParserError => _e
      Hashie::Mash.new({})
    end

    def to_s
      "Docker Host"
    end

    private

    def parse_json_command(labels, subcommand)
      # build command
      format = labels.map { |label| "\"#{label}\": {{json .#{label}}}" }
      raw = inspec.command("docker #{subcommand} --format '{#{format.join(", ")}}'").stdout
      output = []
      # since docker is not outputting valid json, we need to parse each row
      raw.each_line do |entry|
        # convert all keys to lower_case to work well with ruby and filter table
        row = JSON.parse(entry).map do |key, value|
          [key.downcase, value]
        end.to_h

        # ensure all keys are there
        row = ensure_keys(row, labels)

        # strip off any linked container names
        # Depending on how it was linked, the actual container name may come before
        # or after the link information, so we'll just look for the first name that
        # does not include a slash since that is not a valid character in a container name
        if row["names"]
          row["names"] = row["names"].split(",").find { |c| !c.include?("/") }
        end

        # Split labels on ',' or set to empty array
        # Allows for `docker.containers.where { labels.include?('app=redis') }`
        row["labels"] = row.key?("labels") ? row["labels"].split(",") : []

        output.push(row)
      end

      output
    rescue JSON::ParserError => _e
      warn "Could not parse `docker #{subcommand}` output"
      []
    end

    def parse_containers
      # @see https://github.com/moby/moby/issues/20625, works for docker 1.13+
      # raw_containers = inspec.command('docker ps -a --no-trunc --format \'{{ json . }}\'').stdout
      # therefore we stick with older approach
      labels = %w{Command CreatedAt ID Image Labels Mounts Names Ports RunningFor Size Status}

      # Networks LocalVolumes work with 1.13+ only
      if !version.empty? && Gem::Version.new(version["Client"]["Version"]) >= Gem::Version.new("1.13")
        labels.push("Networks")
        labels.push("LocalVolumes")
      end
      parse_json_command(labels, "ps -a --no-trunc")
    end

    def parse_services
      parse_json_command(%w{ID Name Mode Replicas Image Ports}, "service ls")
    end

    def ensure_keys(entry, labels)
      labels.each do |key|
        entry[key.downcase] = nil unless entry.key?(key.downcase)
      end
      entry
    end

    def parse_images
      # docker does not support the `json .` function here, therefore we need to emulate that behavior.
      raw_images = inspec.command('docker images -a --no-trunc --format \'{ "id": {{json .ID}}, "repository": {{json .Repository}}, "tag": {{json .Tag}}, "size": {{json .Size}}, "digest": {{json .Digest}}, "createdat": {{json .CreatedAt}}, "createdsize": {{json .CreatedSince}} }\'').stdout
      c_images = []
      raw_images.each_line do |entry|
        c_images.push(JSON.parse(entry))
      end
      c_images
    rescue JSON::ParserError => _e
      warn "Could not parse `docker images` output"
      []
    end

    def parse_plugins
      plugins = inspec.command('docker plugin ls --format \'{"id": {{json .ID}}, "name": "{{ with split .Name ":"}}{{index . 0}}{{end}}", "version": "{{ with split .Name ":"}}{{index . 1}}{{end}}", "enabled": {{json .Enabled}} }\'').stdout
      c_plugins = []
      plugins.each_line do |entry|
        c_plugins.push(JSON.parse(entry))
      end
      c_plugins
    rescue JSON::ParserError => _e
      warn "Could not parse `docker plugin ls` output"
      []
    end
  end
end
```


## 9. Profile & Resource exercise
### 9.1. Create new profile
Let's start by creating a new profile:
```bash
inspec init profile git
```
### 9.2. Develop controls to test / run controls
Now lets write some controls and test that they run:
```ruby
# encoding: utf-8
# copyright: 2018, The Authors

git_dir = "/home/chef/apache/.git"

# The following banches should exist
describe command("git --git-dir #{git_dir} branch") do
  its('stdout') { should match /master/ }
end

describe command("git --git-dir #{git_dir} branch") do
  its('stdout') { should match /testBranch/ }
end

# What is the current branch
describe command("git --git-dir #{git_dir} branch") do
  its('stdout') { should match /^\* master/ }
end

# What is the latest commit
describe command("git --git-dir #{git_dir} log -1 --pretty=format:'%h'") do
  its('stdout') { should match /48bf020/ }
end

# What is the second to last commit
describe command("git --git-dir #{git_dir} log --skip=1 -1 --pretty=format:'%h'") do
  its('stdout') { should match /09e9064/ }
end
```


## 10. Develop resources to take over above controls
### 10.1. Rewrite first test
Let's rewrite the first test in our example file as follows:
```ruby
# The following banches should exist
describe git(git_dir) do
  its('branches') { should include 'master' }
end
```
Now let's run the profile
```bash
inspec exec git -t ssh://
```
We should get an error because the git method and resource are not defined yet
### 10.2. Develop git resources
Let's start by creating a new file called git.rb in the libraries directory, the content of the file should look like this:
```ruby
# encoding: utf-8
# copyright: 2018, The Authors

class Git < Inspec.resource(1)
    name 'git'

end
```
Now run the profile again
```bash
inspec exec git -t ssh://
```
This time we get another error letting us know that we have a resource that has been given the incorrect number of arguments. This means we have given an additional parameter to this resource that we have not yet accepted.

Each resource will require an initialization method.

For our git.rb file lets add that initialization method:
```ruby
# encoding: utf-8
# copyright: 2018, The Authors

class Git < Inspec.resource(1)
    name 'git'

    def initialize(path)
        @path = path
    end

end
```
This is saving the path we are passing in from the control into an instance method called path.

Now when we run the profile
```bash
inspec exec git -t ssh://
```
The test will run but we will get an error saying we do not have a "branches" method.

So let's go back to our ruby.rb file to fix that as seen below:
```ruby
# encoding: utf-8
# copyright: 2018, The Authors

class Git < Inspec.resource(1)
    name 'git'

    def initialize(path)
        @path = path
    end

    def branches

    end

end
```
At this point all we have done is just define the branches method lets see how the run changes from here
```bash
inspec exec git -t ssh://
```

Now the error message says that the branches method is returning a null value when it's expecting an array or something that is able to accept the include method invoked on it

We can use the inspec helper method which enables you to invoke any other inspec resource as seen below:
```ruby
# encoding: utf-8
# copyright: 2018, The Authors

class Git < Inspec.resource(1)
    name 'git'

    def initialize(path)
        @path = path
    end

    def branches
        inspec.command("git --git-dir #{@path} branch").stdout
    end

end
```
Now we see that we get a passing test!

Now let's adjust our test to also check for our second branch that we created earlier as well as check our current branch:
```ruby
# The following banches should exist
describe git(git_dir) do
  its('branches') { should include 'master' }
  its('branches') { should include 'testBranch' }
  its('current_branch') { should cmp 'master' }
end
```

Let's head over to the git.rb file to create the current_branch method we are invoking in the above test:
```ruby
# encoding: utf-8
# copyright: 2018, The Authors

class Git < Inspec.resource(1)
    name 'git'

    def initialize(path)
        @path = path
    end

    def branches
        inspec.command("git --git-dir #{@path} branch").stdout
    end

    def current_branch
        branch_name = inspec.command("git --git-dir #{@path} branch").stdout.strip.split("\n").find do |name|
            name.start_with?('*')
        end
        branch_name.gsub(/^\*/,'').strip
    end

end
```
Now we can run the profile again
```bash
inspec exec git -t ssh://
```
All the tests should pass!

EXERCISE:  
As solo exercise try to create the final method in the git.rb file to check what is the last commit.
### 10.3. Develop docker resources
### 10.4. Rewrite tests and run controls


## 11. Resource Development exercise
### 11.1. What the resource should do
  - a
  - b
  - c
  - d


## 12. DAY 2: Exercise developing your own resources.
  - 1
    - a
    - b
    - c
  - 2
    - a
    - b
    - c
  - 3
    - a
    - b
    - c
  - 4
    - a
    - b
    - c
  - 5
    - a
    - b
    - c


## 13. DAY 3: Pushing your resource up to inspec
Fork -> Branch -> list directories where changes need to be made.
Go over writing test cases for resource


## 14. DAY 3: Update a few resources that were previously built and show the process for moving that resource to be put in inspec


## 15. Using what you've learned

Now you should be able to
-	Describe the InSpec framework and its capabilities
-	Describe the architecture of an InSpec profile   
-	Build an InSpec profile to transform security policy into automated security testing
-	Run an InSpec profile against a component of an application stack
-	View and analyze InSpec results
-	Report results

You can contribute to existing profiles that can be found here:  
[https://github.com/mitre](https://github.com/mitre)  

Otherwise you can create your own profiles if they don't exist using the following security guidelines:
[https://iase.disa.mil/stigs/Pages/a-z.aspx](https://iase.disa.mil/stigs/Pages/a-z.aspx)  
[https://www.cisecurity.org/cis-benchmarks/](https://www.cisecurity.org/cis-benchmarks/)  


## 16. Additional Resources

### 16.1 Security Guidance
[https://iase.disa.mil/stigs/Pages/a-z.aspx](https://iase.disa.mil/stigs/Pages/a-z.aspx)  
[https://www.cisecurity.org/cis-benchmarks/](https://www.cisecurity.org/cis-benchmarks/)  

### 16.2 InSpec Documentation
[InSpec Docs](https://www.inspec.io/docs/)  
[InSpec Profiles](https://www.inspec.io/docs/reference/profiles/)  
[InSpec Resources](https://www.inspec.io/docs/reference/resources/)  
[InSpec Matchers](https://www.inspec.io/docs/reference/matchers/)  
[InSpec Shell](https://www.inspec.io/docs/reference/shell/)  
[InSpec Reporters](https://www.inspec.io/docs/reference/reporters/)  
[InSpec Profile Inheritance](https://blog.chef.io/2017/07/06/understanding-inspec-profile-inheritance/)  

### 16.3 Additional Tutorials
[What to Expect When You’re InSpec’ing](https://blog.chef.io/2018/04/03/what-to-expect-when-youre-inspecing/)  
[Getting started with InSpec - The InSpec basics series](http://www.anniehedgie.com/inspec/)  
[Windows infrastructure testing using InSpec – Part I](http://datatomix.com/?p=236)  
[Windows infrastructure testing using InSpec and Profiles – Part II](http://datatomix.com/?p=238)  

### 16.4 MITRE InSpec
[MITRE InSpec Repositories](https://github.com/orgs/mitre/teams/inspec/repositories)  
[InSpec Tools](https://github.com/mitre/inspec_tools)  
[Heimdall Lite](https://mitre.github.io/heimdall-lite/#)  

### 16.5. rspec documentation
[Explicit Subject](https://relishapp.com/rspec/rspec-core/docs/subject/explicit-subject)  
[should and should_not](https://github.com/rspec/rspec-expectations/blob/master/Should.md)  
[Built in matchers](https://relishapp.com/rspec/rspec-expectations/docs/built-in-matchers)  

### 16.6. Slack
[Chef Slack](http://community-slack.chef.io/)  
