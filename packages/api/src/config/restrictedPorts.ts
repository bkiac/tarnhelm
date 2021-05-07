/** https://stackoverflow.com/questions/4313403/why-do-browsers-block-some-ports */
import {uniq} from "lodash"

/**
 * https://code.google.com/archive/p/browsersec/wikis/Part2.wiki#Port_access_restrictions
 * https://chromium.googlesource.com/chromium/src.git/+/refs/heads/master/net/base/port_util.cc
 */
export const chrome = [
	1, // tcpmux
	7, // echo
	9, // discard
	11, // systat
	13, // daytime
	15, // netstat
	17, // qotd
	19, // chargen
	20, // ftp data
	21, // ftp access
	22, // ssh
	23, // telnet
	25, // smtp
	37, // time
	42, // name
	43, // nicname
	53, // domain
	77, // priv-rjs
	79, // finger
	87, // ttylink
	95, // supdup
	101, // hostriame
	102, // iso-tsap
	103, // gppitnp
	104, // acr-nema
	109, // pop2
	110, // pop3
	111, // sunrpc
	113, // auth
	115, // sftp
	117, // uucp-path
	119, // nntp
	123, // NTP
	135, // loc-srv /epmap
	139, // netbios
	143, // imap2
	179, // BGP
	389, // ldap
	427, // SLP (Also used by Apple Filing Protocol)
	465, // smtp+ssl
	512, // print / exec
	513, // login
	514, // shell
	515, // printer
	526, // tempo
	530, // courier
	531, // chat
	532, // netnews
	540, // uucp
	548, // AFP (Apple Filing Protocol)
	556, // remotefs
	563, // nntp+ssl
	587, // smtp (rfc6409)
	601, // syslog-conn (rfc3195)
	636, // ldap+ssl
	993, // ldap+ssl
	995, // pop3+ssl
	2049, // nfs
	3659, // apple-sasl / PasswordServer
	4045, // lockd
	6000, // X11
	6665, // Alternate IRC [Apple addition]
	6666, // Alternate IRC [Apple addition]
	6667, // Standard IRC [Apple addition]
	6668, // Alternate IRC [Apple addition]
	6669, // Alternate IRC [Apple addition]
	6697, // IRC + TLS
]

/** https://www-archive.mozilla.org/projects/netlib/portbanning */
export const firefox = [
	1, // tcpmux
	7, // echo
	9, // discard
	11, // systat
	13, // daytime
	15, // netstat
	17, // qotd
	19, // chargen
	20, // ftp data
	21, // ftp control
	22, // ssh
	23, // telnet
	25, // smtp
	37, // time
	42, // name
	43, // nicname
	53, // domain
	77, // priv-rjs
	79, // finger
	87, // ttylink
	95, // supdup
	101, // hostriame
	102, // iso-tsap
	103, // gppitnp
	104, // acr-nema
	109, // POP2
	110, // POP3
	111, // sunrpc
	113, // auth
	115, // sftp
	117, // uucp-path
	119, // NNTP
	123, // NTP
	135, // loc-srv / epmap
	139, // netbios
	143, // IMAP2
	179, // BGP
	389, // LDAP
	465, // SMTP+SSL
	512, // print / exec
	513, // login
	514, // shell
	515, // printer
	526, // tempo
	530, // courier
	531, // chat
	532, // netnews
	540, // uucp
	556, // remotefs
	563, // NNTP+SSL
	587, // submission
	601, // syslog
	636, // LDAP+SSL
	993, // IMAP+SSL
	995, // POP3+SSL
	2049, // nfs
	4045, // lockd
	6000, // X11
]

export const restrictedPorts = uniq([...chrome, ...firefox])
