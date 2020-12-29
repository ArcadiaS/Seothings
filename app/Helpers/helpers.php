<?php

if (!function_exists('getDomainInfo')) {
    function getDomainInfo($url)
    {
        // regex can be replaced with parse_url
        preg_match("/^(https|http|ftp):\/\/(.*?)\//", "$url/", $matches);
        $parts = explode(".", $matches[2]);
        $tld = array_pop($parts);
        $host = array_pop($parts);
        if (strlen($tld) == 2 && strlen($host) <= 3) {
            $tld = "$host.$tld";
            $host = array_pop($parts);
        }

        return [
            'protocol' => $matches[1],
            'subdomain' => implode(".", $parts),
            'domain' => "$host.$tld",
            'host' => $host,
            'tld' => $tld
        ];
    }
}
