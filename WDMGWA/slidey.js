$('.card').mouseenter(function() {
  $(this).css('transform', 'rotate(1deg) scale(1.1)');
});

$('.card').mouseleave(function() {
  $(this).css('transform', 'rotate(0deg) scale(1)');
});