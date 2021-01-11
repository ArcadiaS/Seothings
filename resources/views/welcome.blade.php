<!DOCTYPE html>
<html>

<head>
    <title>Shuffle Comparison</title>
{{--    <script src="bundle.js"></script>--}}
{{--    <script>--}}
{{--        replayjs('auth', {--}}
{{--            site_id: 100000--}}
{{--        })--}}
{{--    </script>--}}
{{--    <script src="rrweb.js"></script>--}}
{{--<script>--}}

{{--    const stopFn = new rrweb.record({--}}
{{--        emit(event) {--}}
{{--        // you should use console.log in this way to avoid errors.--}}
{{--        const defaultLog = console.log["__rrweb_original__"]?console.log["__rrweb_original__"]:console.log;--}}
{{--        defaultLog(event);--}}
{{--    },--}}
{{--    // to use default record option--}}
{{--    recordLog: true,--}}
{{--    });--}}
{{--</script>--}}
<body>
Shuffle moves: <input id="moveCount" type="number" value="1000">

<select id="watchType" onchange="setupWatch();">
    <option value="event">DOM Mutation Events</option>
    <option value="observer">DOM Mutation Observers</option>
    <option value="summary">The Mutation Summary Library</option>
</select>
<button onclick="shuffle();">Shuffle!</button>

  <div style="height: 100px; overflow: scroll">
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
    <p>asdasd</p>
  </div>


<ul id="deck"><li>Ace</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li><li>Jack</li><li>Queen</li><li>King</li></ul>
<div id="new">
    <p id="p1">Tutorix</p>
    <p id="p2">Tutorialspoint</p>
</div>

<h3 id="report"></h3>
</body>
<script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>

</html>
