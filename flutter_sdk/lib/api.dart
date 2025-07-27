//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

library openapi.api;

import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:collection/collection.dart';
import 'package:http/http.dart';
import 'package:intl/intl.dart';
import 'package:meta/meta.dart';

part 'api_client.dart';
part 'api_helper.dart';
part 'api_exception.dart';
part 'auth/authentication.dart';
part 'auth/api_key_auth.dart';
part 'auth/oauth.dart';
part 'auth/http_basic_auth.dart';
part 'auth/http_bearer_auth.dart';

part 'api/app_api.dart';
part 'api/app_management_api.dart';
part 'api/auth_api.dart';
part 'api/customers_api.dart';
part 'api/health_api.dart';
part 'api/storage_api.dart';
part 'api/subscriptions_api.dart';
part 'api/users_api.dart';

part 'model/app_response_dto.dart';
part 'model/checkout_session_dto.dart';
part 'model/confirm_upload_dto.dart';
part 'model/create_app_dto.dart';
part 'model/create_checkout_dto.dart';
part 'model/create_payment_intent_dto.dart';
part 'model/create_portal_session_dto.dart';
part 'model/create_presigned_url_dto.dart';
part 'model/device_dto.dart';
part 'model/device_registration_dto.dart';
part 'model/device_registration_response_dto.dart';
part 'model/device_update_response_dto.dart';
part 'model/devices_list_response_dto.dart';
part 'model/file_dto.dart';
part 'model/forgot_password_dto.dart';
part 'model/forgot_password_response_dto.dart';
part 'model/log_access_dto.dart';
part 'model/login_dto.dart';
part 'model/login_response_dto.dart';
part 'model/payment_intent_dto.dart';
part 'model/portal_session_response_dto.dart';
part 'model/presigned_url_response_dto.dart';
part 'model/profile_response_dto.dart';
part 'model/refresh_token_dto.dart';
part 'model/refresh_token_response_dto.dart';
part 'model/register_dto.dart';
part 'model/register_response_dto.dart';
part 'model/reset_password_dto.dart';
part 'model/reset_password_response_dto.dart';
part 'model/server_limits_dto.dart';
part 'model/stripe_connection_test_response_dto.dart';
part 'model/subscription_dto.dart';
part 'model/subscription_plan_dto.dart';
part 'model/subscription_plans_response_dto.dart';
part 'model/subscription_status_dto.dart';
part 'model/subscriptions_list_response_dto.dart';
part 'model/success_response_dto.dart';
part 'model/sync_stripe_plans_response_dto.dart';
part 'model/update_app_dto.dart';
part 'model/update_profile_dto.dart';
part 'model/user.dart';
part 'model/users_controller_get_all_users200_response.dart';
part 'model/users_controller_update_user_roles_request.dart';
part 'model/verify_email_response_dto.dart';


/// An [ApiClient] instance that uses the default values obtained from
/// the OpenAPI specification file.
var defaultApiClient = ApiClient();

const _delimiters = {'csv': ',', 'ssv': ' ', 'tsv': '\t', 'pipes': '|'};
const _dateEpochMarker = 'epoch';
const _deepEquality = DeepCollectionEquality();
final _dateFormatter = DateFormat('yyyy-MM-dd');
final _regList = RegExp(r'^List<(.*)>$');
final _regSet = RegExp(r'^Set<(.*)>$');
final _regMap = RegExp(r'^Map<String,(.*)>$');

bool _isEpochMarker(String? pattern) => pattern == _dateEpochMarker || pattern == '/$_dateEpochMarker/';
