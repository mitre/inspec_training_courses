# InSpec User 101

## 1. Install Docker
* Windows: https://docs.docker.com/docker-for-windows/install/
* Mac: https://docs.docker.com/docker-for-mac/install/
* Linux: https://docs.docker.com/compose/install/

## 2. Set Up Environment
Start by creating a working directory. We recommend `~/learn_inspec`

```$ mkdir ~/learn_inspec```

Next, move to your working directory.

```$ cd ~/learn_inspec```

Next, get the Docker Compose file. Run the command that matches your system to download a file named docker-compose.yml.

**Windows:**

```$ Invoke-WebRequest -useb -o docker-compose.yml https://raw.githubusercontent.com/learn-chef/inspec/master/docker-compose.yml```

**Mac:**

```$ curl -o docker-compose.yml https://raw.githubusercontent.com/learn-chef/inspec/master/docker-compose.yml```

**Linux:**

```$ wget https://raw.githubusercontent.com/learn-chef/inspec/master/docker-compose.yml```

Next, run the following docker-compose command to retrieve the latest workstation images.

```$ docker-compose pull```

Next, run the following docker-compose command to start the containers. The -d argument starts the containers in the background.

```$ docker-compose up -d```

Now that your containers are running in the background, run this command to start an interactive Bash session on the workstation container.

```$ docker exec -it workstation bash```

## 3. Detect and correct manually

###Phase 1: Detect

Remember, the first phase of meeting your compliance goals is to detect potential issues. Run the following dpkg command to check whether the auditd package is installed.

```$ dpkg -s auditd | grep Status```

###Phase 2: Correct

The second phase is the correct phase. To correct this issue, run the following apt-get install command to install the auditd package.

```$ apt-get install -y auditd```

Next, run the `dpkg` command a second time to verify that auditd is installed.

```$ dpkg -s auditd | grep Status```

Although this is an elementary example, you may notice some potential problems with this manual approach.

Although this is an elementary example, you may notice some potential problems with this manual approach.

* It's not portable.
  * dpkg and apt-get are specific to Ubuntu and other Debian-based systems.
  * auditd is called audit on other Linux distributions.
* It's tedious and time-consuming.
  * Changes, even smalls ones, made to your systems may require a complete audit pass.
* It's error prone.
  * Manual processes are prone to human error.
* It's not documented.
  * You need a way to document the requirements and processes in a way others on your team can use.
* It's not verifiable.
  * You need a way to collect and report the results to your compliance officer consistently.

Arguably, shell scripts bring you one step closer to automating the process. However, the use of shell scripts still suffers from many of the problems described here.

## 4. Detect using InSpec

### 4.1 Explore the InSpec CLI

In practice, you typically run InSpec remotely on your targets, or the systems you want to monitor. InSpec works over the SSH protocol when scanning Linux systems, and the WinRM protocol when scanning Windows systems. Therefore, InSpec requires no software to be installed on the target system.

From your workstation container, start by running inspec help to see what commands are available.

```$ inspec help```

You can learn more about each of these commands in the [documentation.](https://www.inspec.io/docs/reference/cli/)

As an example, run inspec detect to list information about the operating system.

```$ inspec detect```

### 4.2 Download the auditd profile

Start by moving to the /root directory on your container.

```$ cd /root```

Next, run this `git clone` command to download a profile named `auditd`.

```$ git clone https://github.com/learn-chef/auditd.git```

Run `tree` to see what's in the `auditd` profile.

```$ tree auditd```

These files are collectively called a profile. You'll learn more about how these files are structured in later modules.

The file _/root/auditd/controls/example.rb_ contains your InSpec test. Print it to the console.

```$ cat auditd/controls/example.rb```

The code you see is InSpec. This test states that the package auditd should be installed. It expresses the same requirement as the dpkg -s auditd command you ran earlier. You'll learn more about the structure of an InSpec test later.

### 4.3 Run the auditd profile

Run the following inspec exec command to execute your profile directly against your workstation. An InSpec profile is identified by its pathname; here, /root/auditd is the full path to your profile on disk.

```$ inspec exec /root/auditd```

You see that the test succeeds. That's because you manually installed the auditd package earlier. If you had not installed the auditd package, the test would fail.

In practice, you typically write InSpec code from your workstation and then run your tests remotely on your target systems. Let's try that now.

To run a profile remotely, you run inspec exec much like you just did. However, you also specify the -t argument to specify the URI of your target system. Here, you'll use the ssh:// scheme to target your Docker container over SSH.

Run inspec exec like this to run the auditd profile on your container.

```$ inspec exec auditd -t ssh://root:password@target```

As you might expect, the InSpec test fails because you installed the auditd package on your workstation system, not your target system.

Let's break down the target argument, `ssh://root:password@target`:

* `ssh://` is the scheme. It specifies an SSH connection.
* `root:password` is the username and password for the account that permits SSH access. inspec exec also supports key-based authentication.
* `target` is the hostname of the target system. The Docker image comes preconfigured with this hostname. You could also specify a target system by its IP address.

### 4.4 Format output

Your compliance process may also include a report that details the status of each system in your fleet. The inspec exec command provides the --format argument, which transforms the output to a predefined format.

Run the following command to run the auditd profile on your target system and format the output as JSON. In this example, the output is piped to jq, which pretty-prints the output.

```$ inspec exec auditd -t ssh://root:password@target --reporter=json | jq .```

An InSpec profile can contain dozens or hundreds of tests. You can use the JSON output to generate reports that you provide as part of your compliance handoff process.

### 4.5 Package your profile

Although you can specify a profile directly from its sources, you can also package a profile as a compressed archive to make it easier to share. You can package profiles in tar.gz or zip format.

Let's package your auditd profile. But first, from your /root directory, run the following inspec check command to verify your profile is free of errors.

```$ inspec check auditd```

Now run the following inspec archive command to archive your profile.

```$ inspec archive auditd```

Run ls to see the generated file.

```$ ls | grep auditd```

You can run InSpec directly from an archive. To see this, run inspec exec like this.

```$ inspec exec auditd-0.1.0.tar.gz -t ssh://root:password@target```

You can publish your archive to a location where your systems can access it. You can also run the archived profile from that archive location. We've provided a copy of auditd-0.1.0.tar.gz on GitHub so you can see this in action. Run it like this.

```$ inspec exec https://github.com/learn-chef/auditd/releases/download/v0.1.0/auditd-0.1.0.tar.gz -t ssh://root:password@target```

## 5. Use a community profile

In the previous part, you ran the auditd profile that you created. You can also use profiles created by the InSpec community.

If you're familiar with Chef, you know that Chef Supermarket is a place for the community to share Chef cookbooks. You can also use and contribute InSpec profiles through Chef Supermarket.

Your auditd profile checks whether the auditd package is installed. But there are also other aspects of this package you might want to check. For example, you might want to verify that its configuration:

  * specifies the correct location of the log file.
  * incrementally writes audit log data to disk.
  * writes a warning to the syslog if disk space becomes low.
  * suspends the daemon if the disk becomes full.
  
You can express these requirements in your profile. However, might there be an existing profile that takes care of these for you?

### 5.1. Discover community profiles

You can browse InSpec profiles on Chef Supermarket, [supermarket.chef.io/tools](supermarket.chef.io/tools). You can also see what's available from the InSpec CLI.

Run `inspec supermarket profiles` to see what's available.


```
$  inspec supermarket profiles
    
   == Available profiles:
    
    * Ansible Fashion Police brucellino/ansible-fashion-police
    * apache2-compliance-test-tthompson thompsontelmate/apache2-compliance-test-tthompson
    * Apache DISA STIG som3guy/apache-disa-stig
    * Black Panther brucellino/black-panther
    * chef-alfresco-inspec-mysql alfresco/chef-alfresco-inspec-mysql
    * chef-alfresco-inspec-tomcat alfresco/chef-alfresco-inspec-tomcat
    * chef-client-hardening sliim/chef-client-hardening
    * CIS Distribution Independent Linux Benchmark dev-sec/cis-linux-benchmark
    * CIS Docker Benchmark dev-sec/cis-docker-benchmark
    * CIS Kubernetes Benchmark dev-sec/cis-kubernetes-benchmark
    * CVE-2016-5195 ndobson/cve-2016-5195
    * DevSec Apache Baseline dev-sec/apache-baseline
    * DevSec Linux Baseline dev-sec/linux-baseline
    * DevSec Linux Patch Baseline dev-sec/linux-patch-baseline
    * DevSec MySQl Baseline dev-sec/mysql-baseline
    * DevSec Nginx Baseline dev-sec/nginx-baseline
    * DevSec PHP Baseline dev-sec/php-baseline
    * DevSec PostgreSQL Baseline dev-sec/postgres-baseline
    * DevSec SSH Baseline dev-sec/ssh-baseline
    * DevSec SSL/TLS Baseline dev-sec/ssl-basline
    * DevSec Windows Baseline dev-sec/windows-baseline
    * DevSec Windows Patch Baseline dev-sec/windows-patch-baseline
    * dev-sec-wrapper imiell/dev-sec-wrapper
    * EC2 Instance - InSpec Profile alexpop/ec2-instance-profile
    * InSpec AEM Security shinesolutions/inspec-aem-security
    * inspec-chef-server jtimberman/inspec-chef-server
    * inspec_java awim/inspec_java
    * inspec-meltdownspectre vibrato/inspec-meltdownspectre
    * inspec-meltdownspectre_old nathandines/inspec-meltdownspectre_old
    * inspec_oracledb awim/inspec_oracledb
    * InSpec Wrapper Profile Example adamleff/inspec-wrapper-profile-example
    * profile-test bigbam505/profile-test
    * RHEL6 STIG paulczar/rhel6-stig
    * SSL Certificate - InSpec Profile alexpop/ssl-certificate-profile
    * /tmp Compliance Profile nathenharvey/tmp-compliance-profile
    * utils alfresco/utils
    * WannaCry Exploit Mitigation adamleff/wannacry-exploit
```
  
You can run `inspec supermarket info` to get more info about a profile. As you explore the available profiles, you might discover the `dev-sec/linux-baseline` profile. Run this command to learn more about it.

```
$   inspec supermarket info dev-sec/linux-baseline
        name:   linux-baseline
        owner:  dev-sec
        url:    https://github.com/dev-sec/linux-baseline
         
        description:   Linux compliance profile, used for Security + DevOps. More information is available at http://dev-sec.io
```

The url field describes where the source code or project page exists. If you navigate to [https://github.com/dev-sec/linux-baseline](https://github.com/dev-sec/linux-baseline), you'd discover that this profile implements tests for the auditd package.

Here's what the [source code](https://github.com/dev-sec/linux-baseline/blob/df64f6c92c79a9042e7105f2ca177cc8dd083c15/controls/package_spec.rb#L83-L104) looks like for these tests.

![Alt text](../images/package-08.png?raw=true "Package-08")

These tests look similar to your `auditd` profile. Notice that this control also identifies the corresponding package name for the running platform (`auditd` versus `audit`) and also tests for multiple features of the [auditd configuration file](https://linux.die.net/man/8/auditd.conf).

If you browse the source code for the dev-sec/linux-baseline profile, you would see that this profile provides many other commonly accepted hardening and security tests for Linux.

### 5.2. Run the linux-baseline profile

Let's try this profile on your container. To do so, run the following `inspec supermarket exec` command.

```
$ inspec supermarket exec dev-sec/linux-baseline -t ssh://root:password@target

[2018-05-05T02:44:17+00:00] WARN: URL target https://github.com/dev-sec/linux-baseline transformed to https://github.com/dev-sec/linux-baseline/archive/master.tar.gz. Consider using the git fetcher
 
Profile: DevSec Linux Security Baseline (linux-baseline)
Version: 2.2.0
Target:  ssh://root@target:22
 
  ✔  os-01: Trusted hosts login
     ✔  File /etc/hosts.equiv should not exist
  ✔  os-02: Check owner and permissions for /etc/shadow
     ✔  File /etc/shadow should exist
     ✔  File /etc/shadow should be file
     ✔  File /etc/shadow should be owned by "root"
     ✔  File /etc/shadow should not be executable
     ✔  File /etc/shadow should not be readable by other
     ✔  File /etc/shadow group should eq "shadow"
     ✔  File /etc/shadow should be writable by owner
     ✔  File /etc/shadow should be readable by owner
     ✔  File /etc/shadow should be readable by group
  ✔  os-03: Check owner and permissions for /etc/passwd
     ✔  File /etc/passwd should exist
     ✔  File /etc/passwd should be file
     ✔  File /etc/passwd should be owned by "root"
     ✔  File /etc/passwd should not be executable
     ✔  File /etc/passwd should be writable by owner
     ✔  File /etc/passwd should not be writable by group
     ✔  File /etc/passwd should not be writable by other
     ✔  File /etc/passwd should be readable by owner
     ✔  File /etc/passwd should be readable by group
     ✔  File /etc/passwd should be readable by other
     ✔  File /etc/passwd group should eq "root"
  ✔  os-04: Dot in PATH variable
     ✔  Environment variable PATH split should not include ""
     ✔  Environment variable PATH split should not include "."
  ×  os-05: Check login.defs (3 failed)
     ✔  File /etc/login.defs should exist
     ✔  File /etc/login.defs should be file
     ✔  File /etc/login.defs should be owned by "root"
     ✔  File /etc/login.defs should not be executable
     ✔  File /etc/login.defs should be readable by owner
     ✔  File /etc/login.defs should be readable by group
     ✔  File /etc/login.defs should be readable by other
     ✔  File /etc/login.defs group should eq "root"
     ✔  login.defs ENV_SUPATH should include "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
     ✔  login.defs ENV_PATH should include "/usr/local/bin:/usr/bin:/bin"
     ×  login.defs UMASK should include "027"
     expected "022" to include "027"
     ×  login.defs PASS_MAX_DAYS should eq "60"
 
     expected: "60"
          got: "99999"
 
     (compared using ==)

     ×  login.defs PASS_MIN_DAYS should eq "7"
 
     expected: "7"
          got: "0"
 
     (compared using ==)

     ✔  login.defs PASS_WARN_AGE should eq "7"
     ✔  login.defs LOGIN_RETRIES should eq "5"
     ✔  login.defs LOGIN_TIMEOUT should eq "60"
     ✔  login.defs UID_MIN should eq "1000"
     ✔  login.defs GID_MIN should eq "1000"
  ↺  os-05b: Check login.defs - RedHat specific
     ↺  Skipped control due to only_if condition.
  ✔  os-06: Check for SUID/ SGID blacklist
     ✔  suid_check diff should be empty
  ✔  os-07: Unique uid and gid
     ✔  /etc/passwd uids should not contain duplicates
     ✔  /etc/group gids should not contain duplicates
  ✔  os-08: Entropy
     ✔  3420 should >= 1000
  ✔  os-09: Check for .rhosts and .netrc file
     ✔  [] should be empty
  ↺  os-10: CIS: Disable unused filesystems
     ↺  Skipped control due to only_if condition.
  ×  os-11: Protect log-directory (1 failed)
     ✔  File /var/log should be directory
     ✔  File /var/log should be owned by "root"
     ×  File /var/log should be grouped into "syslog"
     expected `File /var/log.grouped_into?("syslog")` to return true, got false
  ✔  package-01: Do not run deprecated inetd or xinetd
     ✔  System Package inetd should not be installed
     ✔  System Package xinetd should not be installed
  ✔  package-02: Do not install Telnet server
     ✔  System Package telnetd should not be installed
  ✔  package-03: Do not install rsh server
     ✔  System Package telnetd should not be installed
  ✔  package-05: Do not install ypserv server (NIS)
     ✔  System Package ypserv should not be installed
  ✔  package-06: Do not install tftp server
     ✔  System Package tftp-server should not be installed
  ↺  package-07: Install syslog server package
     ↺  Skipped control due to only_if condition.
  ↺  package-08: Install auditd
     ↺  Skipped control due to only_if condition.
  ✔  package-09: CIS: Additional process hardening
     ✔  System Package prelink should not be installed
  ↺  sysctl-01: IPv4 Forwarding
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-02: Reverse path filtering
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-03: ICMP ignore bogus error responses
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-04: ICMP echo ignore broadcasts
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-05: ICMP ratelimit
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-06: ICMP ratemask
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-07: TCP timestamps
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-08: ARP ignore
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-09: ARP announce
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-10: TCP RFC1337 Protect Against TCP Time-Wait
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-11: Protection against SYN flood attacks
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-12: Shared Media IP Architecture
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-13: Disable Source Routing
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-14: Disable acceptance of all IPv4 redirected packets
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-15: Disable acceptance of all secure redirected packets
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-16: Disable sending of redirects packets
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-17: Disable log martians
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-18: Disable IPv6 if it is not needed
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-19: IPv6 Forwarding
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-20: Disable acceptance of all IPv6 redirected packets
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-21: Disable acceptance of IPv6 router solicitations messages
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-22: Disable Accept Router Preference from router advertisement
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-23: Disable learning Prefix Information from router advertisement
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-24: Disable learning Hop limit from router advertisement
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-25: Disable the system`s acceptance of router advertisement
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-26: Disable IPv6 autoconfiguration
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-27: Disable neighbor solicitations to send out per address
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-28: Assign one global unicast IPv6 addresses to each interface
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-29: Disable loading kernel modules
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-30: Magic SysRq
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-31a: Secure Core Dumps - dump settings
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-31b: Secure Core Dumps - dump path
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-32: kernel.randomize_va_space
     ↺  Skipped control due to only_if condition.
  ↺  sysctl-33: CPU No execution Flag or Kernel ExecShield
     ↺  Skipped control due to only_if condition.
 
 
Profile Summary: 14 successful controls, 2 control failures, 38 controls skipped
Test Summary: 52 successful, 4 failures, 38 skipped
```

You see the status of each test and then a summary at the end.

You can also run the profile directly from the GitHub sources. Run this `inspec exec` command. You'll see similar results.

```$ inspec exec https://github.com/dev-sec/linux-baseline -t ssh://root:password@target```

### 5.3. Run only certain controls

The previous command produced lots of output. What if you wanted to focus only to the tests contained in the "package-08" control, which test the `auditd` package?

One way might be to run the profile and search for the control's name in the output. Try it like this.

```
$  inspec exec https://github.com/dev-sec/linux-baseline -t ssh://root:password@target | grep -A 7 package-08
     ↺  package-08: Install auditd
        ↺  Skipped control due to only_if condition.
     ✔  package-09: CIS: Additional process hardening
        ✔  System Package prelink should not be installed
     ↺  sysctl-01: IPv4 Forwarding
        ↺  Skipped control due to only_if condition.
     ↺  sysctl-02: Reverse path filtering
        ↺  Skipped control due to only_if condition.
```

This approach still requires you to run the entire profile. Plus, you would need to adjust the grep part of the command to print out more lines to see the control as a whole.

A better way might be to specify the `--controls` argument to run only certain controls; in this case, the "package-08" control.

Run the `inspec exec` command again, this time specifying the `--controls package-08` argument.

```
$ inspec exec https://github.com/dev-sec/linux-baseline -t ssh://root:password@target --controls package-08

[2018-05-05T02:44:37+00:00] WARN: URL target https://github.com/dev-sec/linux-baseline transformed to https://github.com/dev-sec/linux-baseline/archive/master.tar.gz. Consider using the git fetcher
 
Profile: DevSec Linux Security Baseline (linux-baseline)
Version: 2.2.0
Target:  ssh://root@target:22
 
  ↺  package-08: Install auditd
     ↺  Skipped control due to only_if condition.
 
 
Profile Summary: 0 successful controls, 0 control failures, 1 control skipped
Test Summary: 0 successful, 0 failures, 1 skipped
```

You see only the results for the "package-08" control. As a bonus, the profile took less time to run.

Knowing where your systems are out of compliance is an essential first step. But how might to correct, or remediate, these failures?

## Automating correction

Recall that earlier in this module, you ran `apt-get install` to install the `auditd` package and remedy the failure.

Although manual correction can get you started, it suffers from a few problems.

* It's not portable.
  * The commands you run to correct issues on one Linux distribution are not necessarily portable to other distributions. For example, apt-get is specific to Debian-based systems, including Ubuntu.
* It's tedious and time-consuming.
  * Manual correction requires you to connect to each system and apply the required changes.
* It's error prone.
  * Manual processes are prone to human error.
* It's not documented.
  * You need a way to document the requirements and processes in a way others on your team can use.
* It's not scalable.
  * You potentially need to manually run the same correction commands on each system in your fleet. Manual correction cannot easily scale to hundreds or thousands of systems.
* It's not repeatable.
  * Many commands fail when you run them a second time. For example, the same mkdir command fails the second time because the target directory already exists. This adds complexity to any shell scripts you might use to correct issues.
  
In practice, you might use Chef or other continuous automation software to correct issues. For example, here's Chef code that installs the auditd package if the package is not installed.

```ruby
package 'auditd' do
  action :install
end
```

If you're interested in Chef, you may also be interested in [Chef Automate](https://www.chef.io/automate/), a full-stack continuous automation platform that helps you build, manage, and deploy better, faster, and safer.

Chef Automate also comes with a number of compliance profiles, including profiles that implement many [DevSec](https://dev-sec.io/) and [CIS](https://www.cisecurity.org/cis-benchmarks/) recommendations.

## Clean up

You can experiment more with your setup. When you're done experimenting, run `exit` to leave your workstation container.

```
$ exit
```

Run `ls` and you see that the `auditd` profile and your `auditd-0.1.0.tar.gz` archive still exist. We leave these files so you can experiment and refer to them later.

```
$ ls

auditd  auditd-0.1.0.tar.gz  docker-compose.yml
```

Run the following docker-compose down command to destroy your setup.

```
$ docker-compose down --rmi all
```

To bring up a fresh installation, run the docker-compose up -d command as you did in step 2.

Other Learn Chef modules use a similar Docker setup. Docker caches your workstation container's ~/.ssh/known_hosts file on your host system. Delete this file to avoid any conflicts the next time you spin up a Docker environment for Learn Chef.

```
$ rm ~/learn_inspec/.ssh/known_hosts
```