#!/usr/bin/env perl

use strict;
use warnings;

print "Content-Type: text/html\n\n";

use File::Copy;
use CGI::Carp qw(fatalsToBrowser); #nice error handling, assuming there's no major syntax issues that prevent the script from running

my $source_dir = "/home/admin/Documents/file";
my $target_dir = "/home/admin/Documents/python_script";

opendir(my $DIR, $source_dir) || die "can't opendir $source_dir: $!";  
my @files = readdir($DIR);

foreach my $t (@files) {
  if (-f "$source_dir/$t" ) {
    # Check with -f only for files (no directories)
    copy "$source_dir/$t", "$target_dir/$t";
  }
}

closedir($DIR);

print "OK\n";

__END__
